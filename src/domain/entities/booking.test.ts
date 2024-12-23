import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";
import { Booking } from "./booking";

describe("Booking Entity", () => {
  it("deve criar uma instância de Booking com todos os atributos", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 100);
    const user = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getGuest()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getGuestsCount()).toBe(2);
  });

  it("deve lançar um erro se o número de hóspedes for igual ou menor ou igual a zero", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 100);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-10");
    const endDate = new Date("2024-12-15");
    const dateRange = new DateRange(startDate, endDate);

    expect(() => {
      new Booking("1", property, guest, dateRange, 0);
    }).toThrow("O número de hóspedes deve ser maior que zero.");
  });

  it("deve lançar um erro ao tentar reservar com número de hóspedes acima do máximo permitido", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 100);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-10");
    const endDate = new Date("2024-12-15");
    const dateRange = new DateRange(startDate, endDate);

    expect(() => {
      new Booking("1", property, guest, dateRange, 5);
    }).toThrow(
      "O número máximo de hóspedes foi excedido. Máximo permitido: 4."
    );
  });

  it("deve calcular o preço total com desconto", () => {
    // Arrange
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-01");
    const endDate = new Date("2024-12-10");
    const dateRange = new DateRange(startDate, endDate);

    // Act
    const booking = new Booking("1", property, guest, dateRange, 4);

    // Assert
    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9);
  });

  it("não deve realizar o agendamento, quando uma propriedade não estiver disponível", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-01");
    const endDate = new Date("2024-12-10");
    const dateRange = new DateRange(startDate, endDate);

    new Booking("1", property, guest, dateRange, 4);

    const startDate2 = new Date("2024-12-02");
    const endDate2 = new Date("2024-12-09");
    const dateRange2 = new DateRange(startDate2, endDate2);

    expect(() => {
      new Booking("2", property, guest, dateRange2, 4);
    }).toThrow("A propriedade não está disponível para o período selecionado.");
  });

  it("deve cancelar uma reserva sem reembolso quando faltar menos de 1 dia para o check-in", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-22");
    const dateRange = new DateRange(startDate, endDate);

    const booking = new Booking("1", property, guest, dateRange, 4);

    const currentDate = new Date("2024-12-20");

    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(600);
  });

  it("deve cancelar uma reserva com reembolso total desde que o cancelamento seja feito com mais de 7 dias de antecedência", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    const booking = new Booking("1", property, guest, dateRange, 4);

    const currentDate = new Date("2024-12-10");

    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("deve cancelar uma reserva com reembolso parcial de 50% desde que o cancelamento seja feito entre 1 a 7 dias de antecedência", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    const booking = new Booking("1", property, guest, dateRange, 4);

    const currentDate = new Date("2024-12-15");

    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(750);
  });

  it("não deve ser permitir cancelar a mesma reserva mais que uma vez", () => {
    const property = new Property("1", "Casa", "Casa de praia", 4, 300);
    const guest = new User("1", "Pedro Furlan");

    const startDate = new Date("2024-12-20");
    const endDate = new Date("2024-12-25");
    const dateRange = new DateRange(startDate, endDate);

    const booking = new Booking("1", property, guest, dateRange, 4);

    const currentDate = new Date("2024-12-15");

    booking.cancel(currentDate);
    expect(booking.getStatus()).toBe("CANCELLED");

    expect(() => {
      booking.cancel(currentDate);
    }).toThrow("A reserva já está cancelada.");
  });
});
