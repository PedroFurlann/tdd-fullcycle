import { Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { BookingMapper } from "../persistence/mappers/booking_mapper";

export class TypeORMBookingRepository implements BookingRepository {
  private readonly repository: Repository<BookingEntity>;

  constructor(repository: Repository<BookingEntity>) {
    this.repository = repository;
  }

  async save(booking: Booking): Promise<void> {
    await this.repository.save(BookingMapper.toPersistence(booking));
  }

  async findById(id: string): Promise<Booking | null> {
    const bookingEntity = await this.repository.findOne({
      where: { id },
      relations: ["property", "guest"],
    });

    if (!bookingEntity) {
      return null;
    }

    return BookingMapper.toDomain(bookingEntity);
  }
}
