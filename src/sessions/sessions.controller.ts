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
} from "@nestjs/swagger";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { SessionStatus } from "../common/enums/session-status.enum";

@ApiTags("sessions")
@Controller("sessions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Get all sessions (admin only)" })
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get("consultant/:consultantId")
  @ApiOperation({ summary: "Get sessions by consultant ID" })
  findByConsultant(@Param("consultantId") consultantId: string) {
    return this.sessionsService.findByConsultant(consultantId);
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Get sessions by client ID" })
  findByClient(@Param("clientId") clientId: string) {
    return this.sessionsService.findByClient(clientId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a session by ID" })
  @ApiResponse({ status: 200, description: "Return the session" })
  @ApiResponse({ status: 404, description: "Session not found" })
  findOne(@Param("id") id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new session" })
  @ApiResponse({ status: 201, description: "Session created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a session" })
  @ApiResponse({ status: 200, description: "Session updated successfully" })
  @ApiResponse({ status: 404, description: "Session not found" })
  update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update session status" })
  @ApiResponse({
    status: 200,
    description: "Session status updated successfully",
  })
  updateStatus(@Param("id") id: string, @Body("status") status: SessionStatus) {
    return this.sessionsService.updateStatus(id, status);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Delete a session (admin only)" })
  @ApiResponse({ status: 200, description: "Session deleted successfully" })
  @ApiResponse({ status: 404, description: "Session not found" })
  remove(@Param("id") id: string) {
    return this.sessionsService.remove(id);
  }
}
