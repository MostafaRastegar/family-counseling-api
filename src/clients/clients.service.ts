import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "./entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { UsersService } from "../users/users.service";
import { UserRole } from "../common/enums/user-role.enum";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private usersService: UsersService
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      relations: ["user"],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async findByUserId(userId: string): Promise<Client | null> {
    return this.clientsRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Check if user exists
    const user = await this.usersService.findOne(createClientDto.userId);

    // Check if user is already a client
    const existingClient = await this.findByUserId(user.id);
    if (existingClient) {
      throw new ConflictException("User is already a client");
    }

    // Update user role
    await this.usersService.update(user.id, { role: UserRole.CLIENT });

    // Create client profile
    const client = this.clientsRepository.create({
      user,
    });

    return this.clientsRepository.save(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    // Update client with any future fields in UpdateClientDto
    Object.assign(client, updateClientDto);

    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
