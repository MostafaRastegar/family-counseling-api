import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Consultant } from "../../consultants/entities/consultant.entity";
import { Client } from "../../clients/entities/client.entity";
import { SessionStatus } from "../../common/enums/session-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity("sessions")
export class Session extends BaseEntity {
  @ApiProperty({
    description: "The consultant providing the session",
    type: () => Consultant,
  })
  @ManyToOne(() => Consultant)
  consultant: Consultant;

  @ApiProperty({
    description: "The client receiving the session",
    type: () => Client,
  })
  @ManyToOne(() => Client)
  client: Client;

  @ApiProperty({
    description: "Session date and time",
    example: "2025-04-15T14:00:00Z",
    format: "date-time",
  })
  @Column()
  date: Date;

  @ApiProperty({
    enum: SessionStatus,
    default: SessionStatus.PENDING,
    description: "Current status of the session",
    example: SessionStatus.CONFIRMED,
    enumName: "SessionStatus",
  })
  @Column({
    type: "text",
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

  @ApiProperty({
    required: false,
    description: "Session notes or summary",
    example:
      "Client had concerns about parenting strategies. Discussed positive reinforcement techniques.",
  })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({
    required: false,
    description: "External messenger identifier (e.g., Telegram chat ID)",
    example: "12345678",
  })
  @Column({ nullable: true })
  messengerId: string;

  @ApiProperty({
    required: false,
    description: "Type of messenger used for communication",
    example: "telegram",
    enum: ["telegram", "whatsapp"],
  })
  @Column({ nullable: true })
  messengerType: string;
}
