import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";

export class UserMapper {
  static toPersistence(domain: User): UserEntity {
    return {
      id: domain.getId(),
      name: domain.getName()
    };
  }

  static toDomain(entity: UserEntity): User {
    return new User(entity.id, entity.name);
  }
}