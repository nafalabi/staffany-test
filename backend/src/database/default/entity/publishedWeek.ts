import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
@Unique(["startDate", "endDate"])
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

