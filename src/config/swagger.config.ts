import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Family Counseling API')
  .setDescription('The Family Counseling API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();