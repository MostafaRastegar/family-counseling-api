import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as path from "path";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database:
    process.env.DATABASE_PATH ||
    path.resolve(__dirname, "../../database/database.sqlite"),
  entities: [path.resolve(__dirname, "../**/*.entity{.ts,.js}")],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
};
