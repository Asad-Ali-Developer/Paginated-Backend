import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationExampleController } from 'src/controllers';
import { DatabaseProvider } from 'src/provider';
import { User, UserSchema } from 'src/schemas';
import { PaginationExampleService } from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PaginationExampleController],
  providers: [PaginationExampleService, DatabaseProvider, Logger],
  exports: [PaginationExampleService],
})
export class PaginationExampleModule {}
