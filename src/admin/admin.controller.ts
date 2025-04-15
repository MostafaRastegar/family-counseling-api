import { Controller, Get, Patch, Param, UseGuards, Body } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get("consultants/pending")
  @ApiOperation({ summary: "Get list of pending consultants" })
  getPendingConsultants() {
    return this.adminService.getPendingConsultants();
  }

  @Patch("consultants/:id/verify")
  @ApiOperation({ summary: "Verify or reject a consultant" })
  @ApiResponse({
    status: 200,
    description: "Consultant verification status updated",
  })
  verifyConsultant(
    @Param("id") id: string,
    @Body("isVerified") isVerified: boolean
  ) {
    return this.adminService.verifyConsultant(id, isVerified);
  }
}
