import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AggregationPipelineExampleService } from 'src/services';

@Controller('aggregation')
export class AggregationPipelineController {
  constructor(
    private readonly aggregationService: AggregationPipelineExampleService,
  ) {}

  /**
   * GET /aggregation
   * Runs the MongoDB aggregation pipeline and returns top 5 cities with user stats
   */
  @Get()
  async runAggregation() {
    try {
      const result = await this.aggregationService.runAggregationExample();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      // Optional: return friendly API error
      throw new HttpException(
        {
          success: false,
          message: 'Failed to run aggregation pipeline',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
