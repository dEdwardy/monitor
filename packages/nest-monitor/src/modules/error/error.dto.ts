import {
  IsDate,
  IsDateString,
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { parseISO } from 'date-fns';
import { ApiProperty } from '@nestjs/swagger';

export class errorDetailDto {
  @IsMongoId()
  id: string;
}

export class errorQueryDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  type?: string;
}

export class customParseDto {
  @Type(() => Number)
  @ApiProperty({ description: 'lineno', required: true })
  lineno: number;

  @Type(() => Number)
  @ApiProperty({ description: 'colno', required: true })
  colno: number;

  @ApiProperty({ description: 'sourcemap', required: true })
  sourcemap: string;
}
