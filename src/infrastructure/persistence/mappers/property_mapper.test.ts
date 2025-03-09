import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("Test Property Mapper", () => {
  it("deve converter PropertyEntity para Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Casa na Praia";
    propertyEntity.description = "Vista para o mar";
    propertyEntity.maxGuests = 6;
    propertyEntity.basePricePerNight = 200;

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property.getId()).toBe(propertyEntity.id);
    expect(property.getName()).toBe(propertyEntity.name);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(
      propertyEntity.basePricePerNight
    );
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.description = "Vista para o mar";
    propertyEntity.maxGuests = 0;
    propertyEntity.basePricePerNight = 200;

    const propertyEntity2 = new PropertyEntity();
    propertyEntity2.name = "Casa na Praia";
    propertyEntity2.description = "Vista para o mar";
    propertyEntity2.maxGuests = 6;
    propertyEntity2.basePricePerNight = 200;

    const propertyEntity3 = new PropertyEntity();
    propertyEntity3.id = "1";
    propertyEntity3.name = "Casa na Praia";
    propertyEntity3.description = "Vista para o mar";
    propertyEntity3.maxGuests = 0;
    propertyEntity3.basePricePerNight = 200;

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "O nome é obrigatório."
    );
    expect(() => PropertyMapper.toDomain(propertyEntity2)).toThrow(
      "O ID é obrigatório."
    );
    expect(() => PropertyMapper.toDomain(propertyEntity3)).toThrow(
      "O número máximo de hóspedes deve ser maior que zero."
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "1",
      "Casa na Praia",
      "Vista para o mar",
      6,
      200
    );

    const propertyEntity = PropertyMapper.toPersistence(property);

    expect(propertyEntity.id).toBe(property.getId());
    expect(propertyEntity.name).toBe(property.getName());
    expect(propertyEntity.description).toBe(property.getDescription());
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
    expect(propertyEntity.basePricePerNight).toBe(
      property.getBasePricePerNight()
    );
  });
});
