import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./entities/session.entity";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { ConsultantsService } from "../consultants/consultants.service";
import { ClientsService } from "../clients/clients.service";
import { SessionStatus } from "../common/enums/session-status.enum";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    private consultantsService: ConsultantsService,
    private clientsService: ClientsService
  ) {}

  async findAll(): Promise<Session[]> {
    return this.sessionsRepository.find({
      relations: ["consultant", "consultant.user", "client", "client.user"],
    });
  }

  async findByConsultant(consultantId: string): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { consultant: { id: consultantId } },
      relations: ["client", "client.user"],
    });
  }

  async findByClient(clientId: string): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { client: { id: clientId } },
      relations: ["consultant", "consultant.user"],
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ["consultant", "consultant.user", "client", "client.user"],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const consultant = await this.consultantsService.findOne(
      createSessionDto.consultantId
    );
    const client = await this.clientsService.findOne(createSessionDto.clientId);

    if (!consultant.isVerified) {
      throw new BadRequestException("Consultant is not verified");
    }

    const session = this.sessionsRepository.create({
      ...createSessionDto,
      date: new Date(createSessionDto.date),
      consultant,
      client,
      status: SessionStatus.PENDING,
    });

    return this.sessionsRepository.save(session);
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto
  ): Promise<Session> {
    const session = await this.findOne(id);

    if (updateSessionDto.date) {
      session.date = new Date(updateSessionDto.date);
    }

    if (updateSessionDto.status) {
      session.status = updateSessionDto.status;
    }

    if (updateSessionDto.notes !== undefined) {
      session.notes = updateSessionDto.notes;
    }

    if (updateSessionDto.messengerId !== undefined) {
      session.messengerId = updateSessionDto.messengerId;
    }

    if (updateSessionDto.messengerType !== undefined) {
      session.messengerType = updateSessionDto.messengerType;
    }

    return this.sessionsRepository.save(session);
  }

  async updateStatus(id: string, status: SessionStatus): Promise<Session> {
    const session = await this.findOne(id);
    session.status = status;
    return this.sessionsRepository.save(session);
  }

  async remove(id: string): Promise<void> {
    const result = await this.sessionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
  }
}
