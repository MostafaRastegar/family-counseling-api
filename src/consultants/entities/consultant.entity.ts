import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Availability } from "./availability.entity";

@Entity("consultants")
export class Consultant extends BaseEntity {
  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @ApiProperty({ description: "Consultant specialties", type: [String] })
  @Column("simple-array")
  specialties: string[];

  @ApiProperty({ description: "Consultant biography" })
  @Column("text")
  bio: string;

  @ApiProperty({ description: "Education and qualifications" })
  @Column("text")
  education: string;

  @ApiProperty({ default: 0 })
  @Column({ type: "float", default: 0 })
  rating: number;

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  reviewCount: number;

  @ApiProperty({ default: false })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  consultantLicense: string;

  @OneToMany(() => Availability, (availability) => availability.consultant)
  availabilities: Availability[];
}
