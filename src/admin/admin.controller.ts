import { Controller, Get, Patch, Param, UseGuards, Body } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { DashboardStatsDto } from "./dto/dashboard-stats.dto";
import { Consultant } from "../consultants/entities/consultant.entity";

@ApiTags("admin")
@Controller("admin")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiResponse({
    status: 200,
    description: "Returns dashboard statistics",
    type: DashboardStatsDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  getDashboardStats(): Promise<DashboardStatsDto> {
    return this.adminService.getDashboardStats();
  }

  @Get("consultants/pending")
  @ApiOperation({ summary: "Get list of pending consultants" })
  @ApiResponse({
    status: 200,
    description: "Returns consultants pending verification",
    type: [Consultant],
  })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  getPendingConsultants(): Promise<Consultant[]> {
    return this.adminService.getPendingConsultants();
  }

  @Patch("consultants/:id/verify")
  @ApiOperation({ summary: "Verify or reject a consultant" })
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiBody({
    schema: {
      type: "object",
      required: ["isVerified"],
      properties: {
        isVerified: {
          type: "boolean",
          description: "Verification status",
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Consultant verification status updated",
    type: Consultant,
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  verifyConsultant(
    @Param("id") id: string,
    @Body("isVerified") isVerified: boolean
  ): Promise<Consultant> {
    return this.adminService.verifyConsultant(id, isVerified);
  }
}
