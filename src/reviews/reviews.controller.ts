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
} from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("reviews")
@Controller("reviews")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: "Get all reviews" })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get("consultant/:consultantId")
  @ApiOperation({ summary: "Get reviews by consultant ID" })
  findByConsultant(@Param("consultantId") consultantId: string) {
    return this.reviewsService.findByConsultant(consultantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a review by ID" })
  @ApiResponse({ status: 200, description: "Return the review" })
  @ApiResponse({ status: 404, description: "Review not found" })
  findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new review" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Session already has a review" })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Delete a review (admin only)" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  remove(@Param("id") id: string) {
    return this.reviewsService.remove(id);
  }
}
