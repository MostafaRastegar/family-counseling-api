import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { Session } from "./entities/session.entity";
import { ConsultantsModule } from "../consultants/consultants.module";
import { ClientsModule } from "../clients/clients.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    ConsultantsModule,
    ClientsModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
