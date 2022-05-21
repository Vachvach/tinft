import type { AbstractDto } from '../common/dtos/abstract.dto';

export interface IAbstract<DTO extends AbstractDto> {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  toDto(options?: any): DTO;
}
