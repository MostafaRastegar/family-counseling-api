import {
  Controller,
  Get,
  Post,
  Body,
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
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { Review } from "./entities/review.entity";
import { ApiResponseDto } from "../common/dto/api-response.dto";

@ApiTags("reviews")
@Controller("reviews")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: "Get all reviews" })
  @ApiResponse({
    status: 200,
    description: "Returns all reviews",
    type: [Review],
  })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get("consultant/:consultantId")
  @ApiOperation({ summary: "Get reviews by consultant ID" })
  @ApiParam({
    name: "consultantId",
    description: "Consultant ID",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Returns reviews for the specified consultant",
    type: [Review],
  })
  @ApiResponse({ status: 404, description: "Consultant not found" })
  findByConsultant(@Param("consultantId") consultantId: string) {
    return this.reviewsService.findByConsultant(consultantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a review by ID" })
  @ApiParam({ name: "id", description: "Review ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Return the review",
    type: Review,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new review" })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: "Review created successfully",
    type: Review,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input or session not completed",
  })
  @ApiResponse({
    status: 404,
    description: "Consultant, client, or session not found",
  })
  @ApiResponse({ status: 409, description: "Session already has a review" })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Delete a review (admin only)" })
  @ApiParam({ name: "id", description: "Review ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Review deleted successfully",
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Requires admin role" })
  remove(@Param("id") id: string) {
    return this.reviewsService.remove(id);
  }
}
