import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { SessionStatus } from "../common/enums/session-status.enum";
import { Session } from "./entities/session.entity";
import { ApiResponseDto } from "../common/dto/api-response.dto";

@ApiTags("sessions")
@Controller("sessions")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Get all sessions (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Returns all sessions",
    type: [Session],
  })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get("consultant/:consultantId")
  @ApiOperation({ summary: "Get sessions by consultant ID" })
  @ApiParam({
    name: "consultantId",
    description: "Consultant ID",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Returns sessions for the specified consultant",
    type: [Session],
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  findByConsultant(@Param("consultantId") consultantId: string) {
    return this.sessionsService.findByConsultant(consultantId);
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Get sessions by client ID" })
  @ApiParam({ name: "clientId", description: "Client ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Returns sessions for the specified client",
    type: [Session],
  })
  @ApiResponse({ status: 404, description: "Client not found" })
  findByClient(@Param("clientId") clientId: string) {
    return this.sessionsService.findByClient(clientId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a session by ID" })
  @ApiParam({ name: "id", description: "Session ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the session",
    type: Session,
  })
  @ApiResponse({ status: 404, description: "Session not found" })
  findOne(@Param("id") id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new session" })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: "Session created successfully",
    type: Session,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input or consultant not verified",
  })
  @ApiResponse({ status: 404, description: "Consultant or client not found" })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a session" })
  @ApiParam({ name: "id", description: "Session ID", type: String })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    description: "Session updated successfully",
    type: Session,
  })
  @ApiResponse({ status: 404, description: "Session not found" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input" })
  update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update session status" })
  @ApiParam({ name: "id", description: "Session ID", type: String })
  @ApiBody({
    schema: {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          type: "string",
          enum: Object.values(SessionStatus),
          description: "New session status",
          example: SessionStatus.CONFIRMED,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Session status updated successfully",
    type: Session,
  })
  @ApiResponse({ status: 404, description: "Session not found" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid status" })
  updateStatus(@Param("id") id: string, @Body("status") status: SessionStatus) {
    return this.sessionsService.updateStatus(id, status);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Delete a session (admin only)" })
  @ApiParam({ name: "id", description: "Session ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Session deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "Session not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  remove(@Param("id") id: string) {
    return this.sessionsService.remove(id);
  }
}
