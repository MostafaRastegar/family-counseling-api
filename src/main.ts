import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import * as compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { setupSwagger } from "./config/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { PaginationFormatInterceptor } from "./common/interceptors/pagination-format.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useStaticAssets("public"); // Global Middleware
  app.use(compression());

  app.use(helmet());

  // CORS settings
  // CORS Configuration
  app.enableCors({
    origin: configService.get("CORS_ORIGIN", "*"),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validation pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalInterceptors(new PaginationFormatInterceptor());

  setupSwagger(app);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available at: http://localhost:${port}/api`);
}
bootstrap();
