import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toPersistence(domain: Property): PropertyEntity {
    return {
      id: domain.getId(),
      name: domain.getName(),
      description: domain.getDescription(),
      maxGuests: domain.getMaxGuests(),
      basePricePerNight: domain.getBasePricePerNight()
    };
  }

  static toDomain(entity: PropertyEntity): Property {
    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );
  }
}