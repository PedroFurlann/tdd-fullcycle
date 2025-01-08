import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { UserEntity } from "../persistence/entities/user_entity";

describe("TypeORM Property Repository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [PropertyEntity, UserEntity, BookingEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar uma propriedade com sucesso", async () => {
    const property = new Property("1", "Casa", "Casa na praia", 6, 200);

    await propertyRepository.save(property);
    const savedProperty = await repository.findOne({ where: { id: "1" } });

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id).toBe("1");
  });

  it("deve retornar uma propriedade quando um id válido for fornecido", async () => {
    const property = new Property("1", "Casa", "Casa na praia", 6, 200);

    await propertyRepository.save(property);
    const savedProperty = await propertyRepository.findById("1");

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.getId()).toBe("1");
  });

  it("deve retornar nulo quando um id inválido for fornecido", async () => {
    const property = await propertyRepository.findById("2");

    expect(property).toBeNull();
  });
});
