import { Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("clients")
export class Client extends BaseEntity {
  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;
}
