import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
@Index(["startDate", "endDate"])
@Index(["startDate"])
export default class PublishedWeek extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "date",
  })
  startDate: string;

  @Column({
    type: "date",
  })
  endDate: string;
}

