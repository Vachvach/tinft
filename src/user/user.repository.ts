import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByPublicAddress(incomingPaddr: string): Promise<UserEntity | null> {
    return await this.findOne({
      where: {
        publicAddress: incomingPaddr,
      },
    });
  }
}
