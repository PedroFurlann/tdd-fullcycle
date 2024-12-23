import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Property Entity", () => {
  it("deve criar uma instância de Property com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa de praia",
      "Uma bela casa na praia",
      4,
      200
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de praia");
    expect(property.getDescription()).toBe("Uma bela casa na praia");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("deve lançar um erro se o id for vazio", () => {
    expect(() => {
      new Property("", "Casa", "Descrição", 4, 200);
    }).toThrow("O ID é obrigatório.");
  });

  it("deve lançar um erro se o nome for vazio", () => {
    expect(() => {
      new Property("1", "", "Descrição", 4, 200);
    }).toThrow("O nome é obrigatório.");
  });

  it("deve lançar um erro se o número máximo de hóspedes for zero ou negativo", () => {
    expect(() => {
      new Property("1", "Casa", "Descrição", 0, 200);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero.");
  });

  it("deve validar o número máximo de hóspedes", () => {
    const property = new Property("1", "Casa", "Descrição", 5, 200);

    expect(() => {
      property.validateGuestCount(6);
    }).toThrow(
      "O número máximo de hóspedes foi excedido. Máximo permitido: 5."
    );
  });

  it("não deve aplicar desconto para estadias menores que 7 noites", () => {
    const property = new Property("1", "Casa", "Descrição", 5, 200);

    const startDate = new Date("2024-12-10");
    const endDate = new Date("2024-12-16");

    const dateRange = new DateRange(startDate, endDate);

    const totalPrice = property.calculateTotalPrice(dateRange);

    expect(totalPrice).toBe(1200);
  });

  it("deve aplicar desconto de 10% para estadias de 7 noites ou mais", () => {
    const property = new Property("1", "Casa", "Descrição", 5, 200);

    const startDate = new Date("2024-12-10");
    const endDate = new Date("2024-12-17");

    const dateRange = new DateRange(startDate, endDate);

    const totalPrice = property.calculateTotalPrice(dateRange);

    expect(totalPrice).toBe(1260);
  });

  it("deve verificar disponibilidade da propriedade", () => {
    const property = new Property("1", "Casa", "Descrição", 5, 200);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");

    const dateRange = new DateRange(startDate, endDate);

    const startDate2 = new Date("2024-12-22");
    const endDate2 = new Date("2024-12-27");

    const dateRange2 = new DateRange(startDate2, endDate2);

    new Booking("1", property, guest, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});
