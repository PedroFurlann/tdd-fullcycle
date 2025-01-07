import { Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserMapper } from "../persistence/mappers/user_mapper";

export class TypeORMUserRepository implements UserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(repository: Repository<UserEntity>) {
    this.repository = repository;
  }

  async save(user: User): Promise<void> {
    await this.repository.save(UserMapper.toPersistence(user));
  }
  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });

    if (!userEntity) {
      return null;
    }

    return UserMapper.toDomain(userEntity);
  }
}
