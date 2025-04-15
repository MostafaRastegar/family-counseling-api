import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { ConsultantsService } from "./consultants.service";
import { CreateConsultantDto } from "./dto/create-consultant.dto";
import { UpdateConsultantDto } from "./dto/update-consultant.dto";
import { ConsultantFilterDto } from "./dto/consultant-filter.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { Consultant } from "./entities/consultant.entity";
import { Availability } from "./entities/availability.entity";
import { ApiResponseDto } from "../common/dto/api-response.dto";

@ApiTags("consultants")
@Controller("consultants")
export class ConsultantsController {
  constructor(private readonly consultantsService: ConsultantsService) {}

  @Get(":id/availabilities")
  @ApiOperation({ summary: "Get all availabilities for a consultant" })
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the consultant availabilities",
    type: [Availability],
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  findAllAvailabilities(@Param("id") id: string) {
    return this.consultantsService.findAllAvailabilities(id);
  }

  @Get("availabilities/:id")
  @ApiOperation({ summary: "Get an availability by id" })
  @ApiParam({ name: "id", description: "Availability ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the availability",
    type: Availability,
  })
  @ApiResponse({ status: 404, description: "Availability not found" })
  findAvailabilityById(@Param("id") id: string) {
    return this.consultantsService.findAvailabilityById(id);
  }

  @Post("availabilities")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new availability" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAvailabilityDto })
  @ApiResponse({
    status: 201,
    description: "Availability created successfully",
    type: Availability,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({
    status: 409,
    description: "Time slot overlaps with existing availability",
  })
  createAvailability(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.consultantsService.createAvailability(createAvailabilityDto);
  }

  @Patch("availabilities/:id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @ApiOperation({ summary: "Update an availability" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Availability ID", type: String })
  @ApiBody({ type: UpdateAvailabilityDto })
  @ApiResponse({
    status: 200,
    description: "Availability updated successfully",
    type: Availability,
  })
  @ApiResponse({ status: 404, description: "Availability not found" })
  @ApiResponse({ status: 400, description: "Bad request" })
  updateAvailability(
    @Param("id") id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto
  ) {
    return this.consultantsService.updateAvailability(
      id,
      updateAvailabilityDto
    );
  }

  @Delete("availabilities/:id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @ApiOperation({ summary: "Delete an availability" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Availability ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Availability deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "Availability not found" })
  removeAvailability(@Param("id") id: string) {
    return this.consultantsService.removeAvailability(id);
  }

  @Get(":id/available-slots")
  @ApiOperation({
    summary: "Get available time slots for a consultant on a specific date",
  })
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiQuery({
    name: "date",
    description: "Date in YYYY-MM-DD format",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Return the available time slots",
    type: [Availability],
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  getAvailableTimeSlots(@Param("id") id: string, @Query("date") date: string) {
    return this.consultantsService.getAvailableTimeSlots(id, date);
  }

  @Get()
  @ApiOperation({ summary: "Get all consultants with optional filtering" })
  @ApiQuery({ type: ConsultantFilterDto, required: false })
  @ApiResponse({
    status: 200,
    description: "Returns a list of consultants",
    type: [Consultant],
  })
  findAll(@Query() filterDto: ConsultantFilterDto) {
    return this.consultantsService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a consultant by id" })
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the consultant",
    type: Consultant,
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  findOne(@Param("id") id: string) {
    return this.consultantsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new consultant profile" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateConsultantDto })
  @ApiResponse({
    status: 201,
    description: "Consultant created successfully",
    type: Consultant,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User is already a consultant" })
  create(@Body() createConsultantDto: CreateConsultantDto) {
    return this.consultantsService.create(createConsultantDto);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @ApiOperation({ summary: "Update a consultant profile" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiBody({ type: UpdateConsultantDto })
  @ApiResponse({
    status: 200,
    description: "Consultant updated successfully",
    type: Consultant,
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  update(
    @Param("id") id: string,
    @Body() updateConsultantDto: UpdateConsultantDto
  ) {
    return this.consultantsService.update(id, updateConsultantDto);
  }

  @Patch(":id/verify")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Verify a consultant" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiBody({
    schema: {
      type: "object",
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
    description: "Consultant verification updated",
    type: Consultant,
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  verify(@Param("id") id: string, @Body("isVerified") isVerified: boolean) {
    return this.consultantsService.verify(id, isVerified);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete a consultant" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Consultant ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Consultant deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  remove(@Param("id") id: string) {
    return this.consultantsService.remove(id);
  }
}
