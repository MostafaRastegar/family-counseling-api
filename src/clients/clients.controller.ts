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
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all clients (admin only)" })
  @ApiBearerAuth()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a client by id" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Return the client" })
  @ApiResponse({ status: 404, description: "Client not found" })
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new client profile" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: "Client created successfully" })
  @ApiResponse({ status: 409, description: "User is already a client" })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a client profile" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Client updated successfully" })
  @ApiResponse({ status: 404, description: "Client not found" })
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete a client (admin only)" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Client deleted successfully" })
  @ApiResponse({ status: 404, description: "Client not found" })
  remove(@Param("id") id: string) {
    return this.clientsService.remove(id);
  }
}
