import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Consultant } from "../../consultants/entities/consultant.entity";
import { Client } from "../../clients/entities/client.entity";
import { SessionStatus } from "../../common/enums/session-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity("sessions")
export class Session extends BaseEntity {
  @ManyToOne(() => Consultant)
  consultant: Consultant;

  @ManyToOne(() => Client)
  client: Client;

  @ApiProperty({ description: "Session date and time" })
  @Column()
  date: Date;

  @ApiProperty({ enum: SessionStatus, default: SessionStatus.PENDING })
  @Column({
    type: "text",
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  messengerId: string; // شناسه مکالمه در پیام‌رسان

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  messengerType: string; // نوع پیام‌رسان (تلگرام، واتس‌اپ و...)
}
