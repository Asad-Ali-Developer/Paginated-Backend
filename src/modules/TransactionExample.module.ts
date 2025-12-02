import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionExampleController } from 'src/controllers';
import { DatabaseProvider } from 'src/provider';
import { User, UserSchema } from 'src/schemas';
import { TransactionExampleService } from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TransactionExampleController],
  providers: [TransactionExampleService, DatabaseProvider],
  exports: [TransactionExampleService],
})
export class TransactionExampleModule {}
