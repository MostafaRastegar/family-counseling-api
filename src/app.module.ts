import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { databaseConfig } from "./config/database.config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConsultantsModule } from "./consultants/consultants.module";
import { ClientsModule } from "./clients/clients.module";
import { SessionsModule } from "./sessions/sessions.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { MessagingModule } from "./messaging/messaging.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    // Environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database connection configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => databaseConfig,
    }),

    // Application modules
    AuthModule,
    UsersModule,
    ConsultantsModule,
    ClientsModule,
    SessionsModule,
    ReviewsModule,
    MessagingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
