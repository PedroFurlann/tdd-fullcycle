import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

describe("Test Booking Mapper", () => {
  const mockProperty = new Property(
    "prop-id",
    "Test Property",
    "Description",
    4,
    100
  );
  const mockUser = new User("user-id", "John Doe");
  const mockDateRange = new DateRange(
    new Date("2025-05-01"),
    new Date("2025-05-07")
  );
  const mockBooking = new Booking(
    "booking-id",
    mockProperty,
    mockUser,
    mockDateRange,
    2
  );
  mockBooking["totalPrice"] = 700;
  mockBooking["status"] = "CONFIRMED";
  it("deve converter BookingEntity para Booking corretamente", () => {
    const bookingEntity: BookingEntity = {
      id: "booking-id",
      property: PropertyMapper.toPersistence(mockProperty),
      guest: UserMapper.toPersistence(mockUser),
      startDate: mockDateRange.getStartDate(),
      endDate: mockDateRange.getEndDate(),
      guestCount: 2,
      totalPrice: 700,
      status: "CONFIRMED",
    };

    const domain = BookingMapper.toDomain(bookingEntity);

    expect(domain).toBeInstanceOf(Booking);
    expect(domain.getId()).toBe("booking-id");
    expect(domain.getProperty()).toEqual(mockProperty);
    expect(domain.getGuest()).toEqual(mockUser);
    expect(domain.getDateRange().getStartDate()).toBe(
      mockDateRange.getStartDate()
    );
    expect(domain.getDateRange().getEndDate()).toBe(mockDateRange.getEndDate());
    expect(domain.getGuestsCount()).toBe(2);
    expect(domain["totalPrice"]).toBe(700);
    expect(domain["status"]).toBe("CONFIRMED");
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const bookingEntity: BookingEntity = {
      id: "booking-id",
      property: PropertyMapper.toPersistence(mockProperty),
      guest: UserMapper.toPersistence(mockUser),
      startDate: mockDateRange.getStartDate(),
      endDate: mockDateRange.getEndDate(),
      guestCount: 0,
      totalPrice: 700,
      status: "CONFIRMED",
    };

    expect(() => BookingMapper.toDomain(bookingEntity)).toThrow(
      "O número de hóspedes deve ser maior que zero."
    );
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const entity = BookingMapper.toPersistence(mockBooking);

    expect(entity).toEqual(
      expect.objectContaining({
        id: "booking-id",
        property: PropertyMapper.toPersistence(mockProperty),
        guest: UserMapper.toPersistence(mockUser),
        startDate: mockDateRange.getStartDate(),
        endDate: mockDateRange.getEndDate(),
        guestCount: 2,
        totalPrice: 700,
        status: "CONFIRMED",
      })
    );
  });
});
