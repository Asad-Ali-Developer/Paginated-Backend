import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  _id: string;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ description: 'Age of the user' })
  age: number;

  @ApiProperty({ description: 'Timestamp when the user was created' })
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the user was last updated' })
  updated_at: Date;
}

export class UserSearchByEmailDto {
  @IsEmail()
  email: string;
}

export class UserSearchByNameDto {
  @IsString()
  name: string;
}
