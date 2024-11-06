import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ name: 'name', description: 'name', required: true })
  name: string;
  @ApiProperty({ name: 'value', description: 'value', required: true })
  value: string;
}

export class UpdateTagDto {
  @ApiProperty({ name: 'id', description: 'id', required: true })
  id: number;
  @ApiProperty({ name: 'name', description: 'name', required: false })
  name?: string;
  @ApiProperty({ name: 'value', description: 'value', required: false })
  value?: string;
}
