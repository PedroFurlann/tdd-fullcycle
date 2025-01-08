import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.getId();
    entity.property = PropertyMapper.toPersistence(domain.getProperty());
    entity.guest = UserMapper.toPersistence(domain.getGuest());
    entity.startDate = domain.getDateRange().getStartDate();
    entity.endDate = domain.getDateRange().getEndDate();
    entity.guestCount = domain.getGuestsCount();
    entity.totalPrice = domain.getTotalPrice();
    entity.status = domain.getStatus();

    return entity
  }

  static toDomain(entity: BookingEntity): Booking {
    const guest = UserMapper.toDomain(entity.guest);
    const property = PropertyMapper.toDomain(entity.property);
    const dateRange = new DateRange(entity.startDate, entity.endDate);

    const booking = new Booking(
      entity.id,
      property,
      guest,
      dateRange,
      entity.guestCount,
    );

    booking["totalPrice"] = entity.totalPrice;
    booking["status"] = entity.status;

    return booking;
  }
}
