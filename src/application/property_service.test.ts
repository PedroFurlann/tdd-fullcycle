import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository";
import { Property } from "../domain/entities/property";

describe("Property Service", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("deve retornar null quando um id inválido for fornecido", async () => {
    const property = await propertyService.findPropertyById("999");

    expect(property).toBeNull();
  });

  it("deve retornar uma propriedade quando um ID váilido for fornecido", async () => {
    const property = await propertyService.findPropertyById("1");

    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Casa");
  });

  it("deve salvar uma nova propriedade com sucesso e buscá-la novamente", async () => {
    const newProperty = new Property("3", "Fake property", "Fake description", 4, 200);

    await fakePropertyRepository.save(newProperty);

    const property = await fakePropertyRepository.findById("3");

    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Fake property");
  });
});
