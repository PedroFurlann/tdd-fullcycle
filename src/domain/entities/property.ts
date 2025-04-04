import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  private readonly bookings: Booking[] = [];

  constructor(
    private id: string,
    private name: string,
    private description: string,
    private maxGuests: number,
    private basePricePerNight: number
  ) {
    this.validatePropertyData(id, name, maxGuests, basePricePerNight);

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  private validatePropertyData(
    id: string,
    name: string,
    maxGuests: number,
    basePricePerNight: number
  ): void {
    if (!id) {
      throw new Error("O ID é obrigatório.");
    }

    if (!name) {
      throw new Error("O nome é obrigatório.");
    }

    if (maxGuests <= 0) {
      throw new Error("O número máximo de hóspedes deve ser maior que zero.");
    }

    if (basePricePerNight <= 0) {
      throw new Error("O preço base por noite deve ser maior que zero.");
    }
  }

  validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new Error(
        `O número máximo de hóspedes foi excedido. Máximo permitido: ${this.maxGuests}.`
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();

    let totalPrice = this.basePricePerNight * totalNights;

    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }

    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }
}
