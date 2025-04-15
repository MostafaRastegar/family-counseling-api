import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ConsultantsService } from "../consultants/consultants.service";
import { ClientsService } from "../clients/clients.service";
import { SessionsService } from "../sessions/sessions.service";
import { SessionStatus } from "../common/enums/session-status.enum";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private consultantsService: ConsultantsService,
    private clientsService: ClientsService,
    private sessionsService: SessionsService
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({
      relations: [
        "consultant",
        "consultant.user",
        "client",
        "client.user",
        "session",
      ],
    });
  }

  async findByConsultant(consultantId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { consultant: { id: consultantId } },
      relations: ["client", "client.user", "session"],
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: [
        "consultant",
        "consultant.user",
        "client",
        "client.user",
        "session",
      ],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if consultant, client, and session exist
    const consultant = await this.consultantsService.findOne(
      createReviewDto.consultantId
    );
    const client = await this.clientsService.findOne(createReviewDto.clientId);
    const session = await this.sessionsService.findOne(
      createReviewDto.sessionId
    );

    // Verify that the session is completed
    if (session.status !== SessionStatus.COMPLETED) {
      throw new BadRequestException(
        "Cannot review a session that is not completed"
      );
    }

    // Check if the session already has a review
    const existingReview = await this.reviewsRepository.findOne({
      where: { session: { id: session.id } },
    });

    if (existingReview) {
      throw new ConflictException("Session already has a review");
    }

    // Verify that the consultant and client match those in the session
    if (
      session.consultant.id !== consultant.id ||
      session.client.id !== client.id
    ) {
      throw new BadRequestException(
        "Consultant or client does not match the session"
      );
    }

    // Create the review
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      consultant,
      client,
      session,
    });

    const savedReview = await this.reviewsRepository.save(review);

    // Update consultant's rating
    await this.consultantsService.updateRating(
      consultant.id,
      createReviewDto.rating
    );

    return savedReview;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
