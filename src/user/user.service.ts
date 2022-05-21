import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/services/api.config.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new BadRequestException('error.canNotCreatUser');
    }
  }

  async findByPublicAddress(incomingPA: string): Promise<UserDto | null> {
    const userEntity = await this.userRepository.findByPublicAddress(
      incomingPA,
    );

    return userEntity?.toDto();
  }

  async findByPublicAddressOrCreate(userPublicAddress: string) {
    let user = await this.findByPublicAddress(userPublicAddress);
    if (user) {
      return user;
    } else {
      user = await this.create({
        publicAddress: userPublicAddress,
      });
    }
    return user;
  }
}
