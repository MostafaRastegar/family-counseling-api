import { ApiProperty } from "@nestjs/swagger";

export class DashboardStatsDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalConsultants: number;

  @ApiProperty()
  totalClients: number;

  @ApiProperty()
  totalSessions: number;

  @ApiProperty()
  pendingSessions: number;

  @ApiProperty()
  completedSessions: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  averageRating: number;
}
