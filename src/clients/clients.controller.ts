import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { Client } from "./entities/client.entity";
import { ApiResponseDto } from "../common/dto/api-response.dto";

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all clients (admin only)" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Returns all clients",
    type: [Client],
  })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a client by id" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Client ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the client",
    type: Client,
  })
  @ApiResponse({ status: 404, description: "Client not found" })
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new client profile" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({
    status: 201,
    description: "Client created successfully",
    type: Client,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input" })
  @ApiResponse({ status: 409, description: "User is already a client" })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a client profile" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Client ID", type: String })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({
    status: 200,
    description: "Client updated successfully",
    type: Client,
  })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input" })
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete a client (admin only)" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Client ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Client deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  remove(@Param("id") id: string) {
    return this.clientsService.remove(id);
  }
}
