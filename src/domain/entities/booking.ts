import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private totalPrice: number;

  constructor(
    private id: string,
    private property: Property,
    private guest: User,
    private dateRange: DateRange,
    private guestsCount: number,
    private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED"
  ) {
    if (guestsCount <= 0) {
      throw new Error("O número de hóspedes deve ser maior que zero.");
    }

    property.validateGuestCount(guestsCount);

    if (!property.isAvailable(dateRange)) {
      throw new Error(
        "A propriedade não está disponível para o período selecionado."
      );
    }

    this.id = id;
    this.property = property;
    this.guest = guest;
    this.dateRange = dateRange;
    this.guestsCount = guestsCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = "CONFIRMED";

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getGuest(): User {
    return this.guest;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuestsCount(): number {
    return this.guestsCount;
  }

  getStatus(): "CONFIRMED" | "CANCELLED" {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === "CANCELLED") {
      throw new Error("A reserva já está cancelada.");
    }

    this.status = "CANCELLED";

    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 7) {
      this.totalPrice = 0;
    } else if (daysDiff >= 1) {
      this.totalPrice *= 0.5;
    }
  }
}
