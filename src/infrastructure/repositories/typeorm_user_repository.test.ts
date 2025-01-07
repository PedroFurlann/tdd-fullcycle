import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../../infrastructure/persistence/entities/user_entity";
import { TypeORMUserRepository } from "../../infrastructure/repositories/typeorm_user_repository";

describe("TypeORM User Repository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar um usuário com sucesso", async () => {
    const user = new User("1", "Pedro Furlan");
    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.id).toBe("1");
    expect(savedUser?.name).toBe("Pedro Furlan");
  });

  it("deve retornar um usuário pelo quando um id válido for fornecido", async () => {
    const user = new User("1", "Pedro Furlan");
    await userRepository.save(user);

    const savedUser = await userRepository.findById("1");

    expect(savedUser).not.toBeNull();
    expect(savedUser?.getId()).toBe("1");
    expect(savedUser?.getName()).toBe("Pedro Furlan");
  });

  it("deve retornar nulo quando um id inválido for fornecido", async () => {
    const user = await userRepository.findById("2");

    expect(user).toBeNull();
  });
});
