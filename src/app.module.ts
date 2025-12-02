import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RedisModule,
  PaginationExampleModule,
  TransactionExampleModule,
  AggregationPipelineModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL!),
    RedisModule,
    PaginationExampleModule,
    TransactionExampleModule,
    AggregationPipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
