import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AggregationPipelineController } from 'src/controllers';
import { User, UserSchema } from 'src/schemas';
import { AggregationPipelineExampleService } from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AggregationPipelineController],
  exports: [AggregationPipelineExampleService],
  providers: [AggregationPipelineExampleService],
})
export class AggregationPipelineModule {}
