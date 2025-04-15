// src/common/decorators/api-pagination.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

interface ApiPaginationOptions {
  description?: string;
  additionalQueries?: Array<{
    name: string;
    type: any;
    required?: boolean;
    enum?: any;
    description?: string;
  }>;
}

export function ApiPagination(
  entityName: string,
  options: ApiPaginationOptions = {},
) {
  const description = options.description || `List of ${entityName}`;
  const additionalQueries = options.additionalQueries || [];

  // Default pagination queries
  const defaultQueries = [
    { name: 'page', type: Number, description: 'Page number (starts at 1)' },
    { name: 'limit', type: Number, description: 'Number of items per page' },
  ];

  // Create query decorators
  const queryDecorators = [
    ...defaultQueries.map((query) =>
      ApiQuery({
        name: query.name,
        required: false,
        type: query.type,
        description: query.description,
      }),
    ),
    ...additionalQueries.map((query) =>
      ApiQuery({
        name: query.name,
        required: query.required || false,
        type: query.type,
        enum: query.enum,
        description: query.description,
      }),
    ),
  ];

  return applyDecorators(
    ...queryDecorators,
    ApiResponse({
      status: 200,
      description: description,
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: `#/components/schemas/${entityName}` },
          },
          total: { type: 'number' },
        },
      },
    }),
  );
}
