import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Consultant } from "../../consultants/entities/consultant.entity";
import { Client } from "../../clients/entities/client.entity";
import { Session } from "../../sessions/entities/session.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("reviews")
export class Review extends BaseEntity {
  @ManyToOne(() => Consultant)
  consultant: Consultant;

  @ManyToOne(() => Client)
  client: Client;

  @OneToOne(() => Session)
  @JoinColumn()
  session: Session;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @Column({ type: "int" })
  rating: number;

  @ApiProperty({ description: "Review comment" })
  @Column("text")
  comment: string;
}
