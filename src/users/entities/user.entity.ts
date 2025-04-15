import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { UserRole } from "../../common/enums/user-role.enum";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { instanceToPlain, Exclude } from "class-transformer";

@Entity("users")
export class User extends BaseEntity {
  @ApiProperty({ description: "User email address" })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: "User full name" })
  @Column()
  fullName: string;

  @Exclude()
  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CLIENT })
  @Column({
    type: "text",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  profileImage: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
