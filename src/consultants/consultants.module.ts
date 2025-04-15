import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsultantsService } from "./consultants.service";
import { ConsultantsController } from "./consultants.controller";
import { Consultant } from "./entities/consultant.entity";
import { Availability } from "./entities/availability.entity";
import { UsersModule } from "../users/users.module";
@Module({
  imports: [TypeOrmModule.forFeature([Consultant, Availability]), UsersModule],
  controllers: [ConsultantsController],
  providers: [ConsultantsService],
  exports: [ConsultantsService],
})
export class ConsultantsModule {}
