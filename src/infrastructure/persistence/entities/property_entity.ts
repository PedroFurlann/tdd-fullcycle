import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("properties")
export class PropertyEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ name: "max_guests" })
  maxGuests!: number;

  @Column({ name: "number", type: "decimal" })
  basePricePerNight!: number;
}