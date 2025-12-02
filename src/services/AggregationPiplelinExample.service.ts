import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { User } from 'src/schemas';

@Injectable()
export class AggregationPipelineExampleService {
  private readonly logger = new Logger(AggregationPipelineExampleService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async runAggregationExample() {
    try {
      const pipeline: PipelineStage[] = [
        // 1️⃣ MATCH — Filter users above age 18
        {
          $match: { age: { $gte: 18 } },
        } as PipelineStage,

        // 2️⃣ GROUP — Group by city, count users, calculate average age
        {
          $group: {
            _id: '$city',
            totalUsers: { $sum: 1 },
            avgAge: { $avg: '$age' },
            users: { $push: '$name' },
          },
        } as PipelineStage,

        // 3️⃣ LOOKUP — Join with countries collection
        {
          $lookup: {
            from: 'countries',
            localField: '_id',
            foreignField: 'city',
            as: 'countryInfo',
          },
        } as PipelineStage,

        // 4️⃣ PROJECT — Shape the final response
        {
          $project: {
            city: '$_id',
            totalUsers: 1,
            avgAge: { $round: ['$avgAge', 1] },
            users: 1,
            countryInfo: 1,
            _id: 0,
          },
        } as PipelineStage,

        // 5️⃣ SORT — Sort by totalUsers descending
        {
          $sort: { totalUsers: -1 } as Record<string, 1 | -1>,
        } as PipelineStage,

        // 6️⃣ LIMIT — Top 5
        {
          $limit: 5,
        } as PipelineStage,
      ];

      const result = await this.userModel.aggregate(pipeline);

      return { success: true, data: result };
    } catch (error) {
      this.logger.error('Aggregation failed:', error);
      throw error;
    }
  }
}
