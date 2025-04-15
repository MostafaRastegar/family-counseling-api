import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Consultant } from "../consultants/entities/consultant.entity";
import { Client } from "../clients/entities/client.entity";
import { Session } from "../sessions/entities/session.entity";
import { Review } from "../reviews/entities/review.entity";
import { DashboardStatsDto } from "./dto/dashboard-stats.dto";
import { SessionStatus } from "../common/enums/session-status.enum";
import { ConsultantsService } from "../consultants/consultants.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Consultant)
    private consultantsRepository: Repository<Consultant>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private consultantsService: ConsultantsService
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [
      totalUsers,
      totalConsultants,
      totalClients,
      totalSessions,
      pendingSessions,
      completedSessions,
      totalReviews,
      reviews,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.consultantsRepository.count(),
      this.clientsRepository.count(),
      this.sessionsRepository.count(),
      this.sessionsRepository.count({
        where: { status: SessionStatus.PENDING },
      }),
      this.sessionsRepository.count({
        where: { status: SessionStatus.COMPLETED },
      }),
      this.reviewsRepository.count(),
      this.reviewsRepository.find(),
    ]);

    // Calculate average rating
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      totalUsers,
      totalConsultants,
      totalClients,
      totalSessions,
      pendingSessions,
      completedSessions,
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
    };
  }

  async verifyConsultant(
    consultantId: string,
    isVerified: boolean
  ): Promise<Consultant> {
    return this.consultantsService.verify(consultantId, isVerified);
  }

  async getPendingConsultants(): Promise<Consultant[]> {
    return this.consultantsRepository.find({
      where: { isVerified: false },
      relations: ["user"],
    });
  }
}
