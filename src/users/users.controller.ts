import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
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
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiResponseDto } from "../common/dto/api-response.dto";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Get all users (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Returns all users",
    type: [User],
  })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by id" })
  @ApiParam({ name: "id", description: "User ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the user",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", description: "User ID", type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Delete a user (admin only)" })
  @ApiParam({ name: "id", description: "User ID", type: String })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
