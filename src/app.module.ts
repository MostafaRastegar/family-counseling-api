import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConsultantsModule } from "./consultants/consultants.module";
import { ClientsModule } from "./clients/clients.module";
import { SessionsModule } from "./sessions/sessions.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { MessagingModule } from "./messaging/messaging.module";
import { AdminModule } from "./admin/admin.module";
import * as path from "path";

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
      useFactory: (configService: ConfigService) => ({
        type: "sqlite",
        database: configService.get<string>("DATABASE_URL"),
        autoLoadEntities: true,
        entities: [path.resolve(__dirname, "../**/*.entity{.ts,.js}")],
        synchronize: process.env.NODE_ENV === "development",
        logging: process.env.NODE_ENV === "development",
      }),
      inject: [ConfigService],
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
})
export class AppModule {}
