import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { writeFileSync } from "fs";
import { join } from "path";
import * as fs from "fs";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { UserRole } from "src/common/enums/user-role.enum";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Family Counseling API")
    .setDescription(
      `
      # Family Counseling API Documentation
      
      This API provides the backend services for the Family Counseling Platform.

      ## Authorization
      Most endpoints require JWT authentication. After logging in, include the JWT token in the Authorization header:
      \`\`\`
      Authorization: Bearer YOUR_JWT_TOKEN
      \`\`\`
      
      ## Role-based access
      Different endpoints have different role requirements. The API supports these roles:
      - ${UserRole.ADMIN}: Full access to all endpoints
      - ${UserRole.CONSULTANT}: Access to consultant-specific features
      - ${UserRole.CLIENT}: Access to client-specific features
    `
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .addTag("auth", "Authentication endpoints for registration and login")
    .addTag("users", "User management endpoints")
    .addTag("consultants", "Consultant profile and availability management")
    .addTag("clients", "Client profile management")
    .addTag("sessions", "Session scheduling and management")
    .addTag("reviews", "Consultant reviews and ratings")
    .addTag("messaging", "Messaging integration with external platforms")
    .addTag("admin", "Admin dashboard and management features")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: [ApiResponseDto],
  });

  // Customize Swagger UI
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      docExpansion: "none",
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  });

  // Asegúrate de que el directorio existe
  const publicDir = join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Guarda el documento JSON y YAML para descargar
  writeFileSync(
    join(publicDir, "swagger.json"),
    JSON.stringify(document, null, 2)
  );

  // Prepara HTML personalizado para insertar un script que maneje la persistencia
  const customOptions = {
    customSiteTitle: "HR Management System API",
    customJs: [
      "/swagger-ui/swagger-ui-bundle.js",
      "/swagger-ui/swagger-ui-standalone-preset.js",
      "/swagger-persistence.js", // Archivo JavaScript externo
    ],
    customCssUrl: ["/swagger-ui/swagger-ui.css"],
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      deepLinking: true,
      urls: [
        {
          url: "/swagger.json",
          name: "API Documentation",
        },
      ],
      supportedSubmitMethods: [
        "get",
        "post",
        "put",
        "delete",
        "patch",
        "options",
        "head",
      ],
      displayOperationId: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      downloadUrl: "/swagger.json",
    },
  };

  SwaggerModule.setup("api-docs", app, document, customOptions);
}
