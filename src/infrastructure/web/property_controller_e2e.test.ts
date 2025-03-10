import express from "express";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyController } from "./property_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;

let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;

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

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  propertyService = new PropertyService(propertyRepository);

  const propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("Property Controller", () => {
  it("deve criar uma propriedade com sucesso", async () => {
    const response = await supertest(app).post("/properties").send({
      name: "Casa na Praia",
      description: "Vista para o mar",
      maxGuests: 6,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property.name).toEqual("Casa na Praia");
    expect(response.body.property.description).toEqual("Vista para o mar");
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await supertest(app).post("/properties").send({
      name: "",
      description: "Vista para o mar",
      maxGuests: 6,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("O nome da propriedade é obrigatório.");
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await supertest(app).post("/properties").send({
      name: "Casa na Praia",
      description: "Vista para o mar",
      maxGuests: 0,
      basePricePerNight: 200,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("A capacidade máxima deve ser maior que zero.");
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await supertest(app).post("/properties").send({
      name: "Casa na Praia",
      description: "Vista para o mar",
      maxGuests: 6,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("O preço base por noite é obrigatório.");
  });
});
