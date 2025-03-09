import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserController } from "../web/user_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;

let userRepository: TypeORMUserRepository;
let userService: UserService;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity, PropertyEntity, BookingEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  userService = new UserService(userRepository);

  const userController = new UserController(userService);

  app.post("/users", (req, res, next) => {
    userController.createUser(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("User Controller", () => {
  it("deve criar um usuário com sucesso", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Pedro Furlan" });

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("User created successfully");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.user.name).toEqual("Pedro Furlan");
  });

  it("deve retornar um erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", () => {
    return request(app)
      .post("/users")
      .send({ name: "" })
      .expect(400)
      .expect({ message: "O campo nome é obrigatório."});
  });
});
