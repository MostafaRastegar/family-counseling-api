import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Consultant } from "./entities/consultant.entity";
import { CreateConsultantDto } from "./dto/create-consultant.dto";
import { UpdateConsultantDto } from "./dto/update-consultant.dto";
import { ConsultantFilterDto } from "./dto/consultant-filter.dto";
import { UsersService } from "../users/users.service";
import { UserRole } from "../common/enums/user-role.enum";
import { Availability } from "./entities/availability.entity";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";

@Injectable()
export class ConsultantsService {
  constructor(
    @InjectRepository(Consultant)
    private consultantsRepository: Repository<Consultant>,
    @InjectRepository(Availability)
    private availabilitiesRepository: Repository<Availability>,
    private usersService: UsersService
  ) {}

  async findAllAvailabilities(consultantId: string): Promise<Availability[]> {
    const consultant = await this.findOne(consultantId);

    return this.availabilitiesRepository.find({
      where: { consultant: { id: consultant.id } },
      order: { startTime: "ASC" },
    });
  }

  async findAvailabilityById(id: string): Promise<Availability> {
    const availability = await this.availabilitiesRepository.findOne({
      where: { id },
      relations: ["consultant"],
    });

    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }

    return availability;
  }

  async createAvailability(
    createAvailabilityDto: CreateAvailabilityDto
  ): Promise<Availability> {
    const consultant = await this.findOne(createAvailabilityDto.consultantId);

    // Validate times
    const startTime = new Date(createAvailabilityDto.startTime);
    const endTime = new Date(createAvailabilityDto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException("End time must be after start time");
    }

    // Check for overlapping availabilities
    const overlapping = await this.availabilitiesRepository
      .createQueryBuilder("availability")
      .where("availability.consultant = :consultantId", {
        consultantId: consultant.id,
      })
      .andWhere("availability.isAvailable = true")
      .andWhere(
        "NOT (availability.endTime <= :startTime OR availability.startTime >= :endTime)",
        {
          startTime,
          endTime,
        }
      )
      .getCount();

    if (overlapping > 0) {
      throw new ConflictException(
        "This time slot overlaps with an existing availability"
      );
    }

    const availability = this.availabilitiesRepository.create({
      startTime,
      endTime,
      isAvailable: createAvailabilityDto.isAvailable,
      consultant,
    });

    return this.availabilitiesRepository.save(availability);
  }

  async updateAvailability(
    id: string,
    updateAvailabilityDto: UpdateAvailabilityDto
  ): Promise<Availability> {
    const availability = await this.findAvailabilityById(id);

    // Update startTime if provided
    if (updateAvailabilityDto.startTime) {
      availability.startTime = new Date(updateAvailabilityDto.startTime);
    }

    // Update endTime if provided
    if (updateAvailabilityDto.endTime) {
      availability.endTime = new Date(updateAvailabilityDto.endTime);
    }

    // Validate times after potential updates
    if (availability.startTime >= availability.endTime) {
      throw new BadRequestException("End time must be after start time");
    }

    // Update isAvailable if provided
    if (updateAvailabilityDto.isAvailable !== undefined) {
      availability.isAvailable = updateAvailabilityDto.isAvailable;
    }

    // Check for overlapping availabilities (only if slot is available)
    if (availability.isAvailable) {
      const overlapping = await this.availabilitiesRepository
        .createQueryBuilder("availability")
        .where("availability.consultant = :consultantId", {
          consultantId: availability.consultant.id,
        })
        .andWhere("availability.id != :id", { id })
        .andWhere("availability.isAvailable = true")
        .andWhere(
          "NOT (availability.endTime <= :startTime OR availability.startTime >= :endTime)",
          {
            startTime: availability.startTime,
            endTime: availability.endTime,
          }
        )
        .getCount();

      if (overlapping > 0) {
        throw new ConflictException(
          "This time slot overlaps with an existing availability"
        );
      }
    }

    return this.availabilitiesRepository.save(availability);
  }

  async removeAvailability(id: string): Promise<void> {
    const result = await this.availabilitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
  }

  async getAvailableTimeSlots(
    consultantId: string,
    date: string
  ): Promise<Availability[]> {
    const consultant = await this.findOne(consultantId);

    // Convert date string to Date object for the beginning of the day
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Set end of day
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all available time slots for the given day
    return this.availabilitiesRepository.find({
      where: {
        consultant: { id: consultant.id },
        isAvailable: true,
        startTime: Between(targetDate, endOfDay),
      },
      order: { startTime: "ASC" },
    });
  }

  async findAll(filterDto: ConsultantFilterDto): Promise<Consultant[]> {
    const query = this.consultantsRepository
      .createQueryBuilder("consultant")
      .leftJoinAndSelect("consultant.user", "user");

    if (filterDto.isVerified !== undefined) {
      query.andWhere("consultant.isVerified = :isVerified", {
        isVerified: filterDto.isVerified,
      });
    }

    if (filterDto.search) {
      query.andWhere(
        "user.fullName LIKE :search OR consultant.bio LIKE :search",
        { search: `%${filterDto.search}%` }
      );
    }

    if (filterDto.specialties && filterDto.specialties.length > 0) {
      // SQLite doesn't support array operations, so this is a simple workaround
      // In a production environment with PostgreSQL, we would use array operators
      filterDto.specialties.forEach((specialty, index) => {
        query.andWhere(`consultant.specialties LIKE :specialty${index}`, {
          [`specialty${index}`]: `%${specialty}%`,
        });
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Consultant> {
    const consultant = await this.consultantsRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!consultant) {
      throw new NotFoundException(`Consultant with ID ${id} not found`);
    }

    return consultant;
  }

  async findByUserId(userId: string): Promise<Consultant | null> {
    return this.consultantsRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }

  async create(createConsultantDto: CreateConsultantDto): Promise<Consultant> {
    // Check if user exists
    const user = await this.usersService.findOne(createConsultantDto.userId);

    // Check if user is already a consultant
    const existingConsultant = await this.findByUserId(user.id);
    if (existingConsultant) {
      throw new ConflictException("User is already a consultant");
    }

    // Update user role
    await this.usersService.update(user.id, { role: UserRole.CONSULTANT });

    // Create consultant profile
    const consultant = this.consultantsRepository.create({
      ...createConsultantDto,
      user,
    });

    return this.consultantsRepository.save(consultant);
  }

  async update(
    id: string,
    updateConsultantDto: UpdateConsultantDto
  ): Promise<Consultant> {
    const consultant = await this.findOne(id);

    Object.assign(consultant, updateConsultantDto);

    return this.consultantsRepository.save(consultant);
  }

  async verify(id: string, isVerified: boolean): Promise<Consultant> {
    const consultant = await this.findOne(id);

    consultant.isVerified = isVerified;

    return this.consultantsRepository.save(consultant);
  }

  async updateRating(id: string, rating: number): Promise<Consultant> {
    const consultant = await this.findOne(id);

    const newReviewCount = consultant.reviewCount + 1;
    const currentTotalRating = consultant.rating * consultant.reviewCount;
    const newRating = (currentTotalRating + rating) / newReviewCount;

    consultant.rating = parseFloat(newRating.toFixed(1));
    consultant.reviewCount = newReviewCount;

    return this.consultantsRepository.save(consultant);
  }

  async remove(id: string): Promise<void> {
    const result = await this.consultantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Consultant with ID ${id} not found`);
    }
  }
}
