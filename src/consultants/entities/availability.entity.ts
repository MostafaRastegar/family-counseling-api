import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Consultant } from "./consultant.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("availabilities")
export class Availability extends BaseEntity {
  @ManyToOne(() => Consultant, (consultant) => consultant.availabilities)
  consultant: Consultant;

  @ApiProperty({ description: "Start time of availability" })
  @Column()
  startTime: Date;

  @ApiProperty({ description: "End time of availability" })
  @Column()
  endTime: Date;

  @ApiProperty({ default: true })
  @Column({ default: true })
  isAvailable: boolean;
}
