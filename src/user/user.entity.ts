import { AbstractEntity } from 'src/entities/abstract.entity';
import { Column, Entity, Index } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { IUser } from './interface/IUser';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> implements IUser {
  @Column({ nullable: true })
  @Index({ unique: true })
  publicAddress: string;

  dtoClass = UserDto;
}
