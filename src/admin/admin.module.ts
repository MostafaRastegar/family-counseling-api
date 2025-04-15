import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { User } from "../users/entities/user.entity";
import { Consultant } from "../consultants/entities/consultant.entity";
import { Client } from "../clients/entities/client.entity";
import { Session } from "../sessions/entities/session.entity";
import { Review } from "../reviews/entities/review.entity";
import { ConsultantsModule } from "../consultants/consultants.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Consultant, Client, Session, Review]),
    ConsultantsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
