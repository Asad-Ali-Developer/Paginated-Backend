import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserSearchByEmailDto, UserSearchByNameDto } from 'src/DTOs';
import { PaginationExampleService } from 'src/services';

@Controller('pagination')
export class PaginationExampleController {
  constructor(private readonly service: PaginationExampleService) {}

  @Get('seed')
  seed(@Query('count') count?: number) {
    return this.service.insertBulk(Number(count) || 5000);
  }

  @Get()
  get(@Query('page') page: number, @Query('limit') limit: number) {
    return this.service.getData(Number(page), Number(limit));
  }

  @Get('all')
  getAll() {
    return this.service.getAllData();
  }

  @Get('specific')
  async getUserById(@Query('id') id: string) {
    const user = await this.service.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Get('search-by-email')
  async getUserByEmail(@Body() body: UserSearchByEmailDto) {
    const { email } = body;
    const user = await this.service.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with id ${email} not found`);
    }
    return user;
  }

  @Get('search-by-name')
  async getUserByName(@Body() body: UserSearchByNameDto) {
    const { name } = body;
    const user = await this.service.getUserByName(name);
    if (!user) {
      throw new NotFoundException(`User with id ${name} not found`);
    }
    return user;
  }
}
