import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { Review } from "./entities/review.entity";
import { ConsultantsModule } from "../consultants/consultants.module";
import { ClientsModule } from "../clients/clients.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ConsultantsModule,
    ClientsModule,
    SessionsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
