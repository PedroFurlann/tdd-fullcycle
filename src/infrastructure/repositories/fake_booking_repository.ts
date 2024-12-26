import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";

export class FakeBookingRepository implements BookingRepository {
  private properties: Booking[] = [];

  async findById(id: string): Promise<Booking | null> {
    return this.properties.find((booking) => booking.getId() === id) ?? null;
  }

  async save(booking: Booking): Promise<void> {
    this.properties.push(booking);
  }
}
