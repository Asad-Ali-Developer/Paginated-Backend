import { Injectable, Logger } from '@nestjs/common';
import { DatabaseProvider } from 'src/provider';
import { Model } from 'mongoose';
import { User, UserSchema } from 'src/schemas';
import { RedisService } from './Redis.service';

@Injectable()
export class PaginationExampleService {
  private paginationModel: Model<User>;

  constructor(
    private logger: Logger,
    private readonly redisService: RedisService,
    private readonly databaseProvider: DatabaseProvider,
  ) {
    const connection = this.databaseProvider.getConnection();
    this.paginationModel = connection.model<User>(User.name, UserSchema);
  }

  /**
   * Getter to access the Redis client instance from RedisService
   */
  private get redisClient() {
    return this.redisService.getClient();
  }

  /**
   * Inserts multiple fake user records into the database in bulk.
   * Useful for testing pagination and performance with large datasets.
   * @param count Number of users to insert (default: 5000)
   * @returns Success message with number of inserted users
   */
  async insertBulk(count: number = 5000) {
    const fakeUsers: Partial<User>[] = [];

    for (let i = 0; i < count; i++) {
      fakeUsers.push({
        name: `User_${i}`,
        email: `user${i}@test.com`,
        age: Math.floor(Math.random() * 40) + 18,
      });
    }

    await this.paginationModel.insertMany(fakeUsers);
    return { message: `${count} users inserted successfully.` };
  }

  /**
   * Fetches paginated user data from the database.
   * Checks Redis cache first; if not present, queries MongoDB and caches result.
   * @param page Page number (default: 1)
   * @param limit Number of records per page (default: 10)
   * @returns Paginated data with metadata including total count and next page
   */
  async getData(page: number = 1, limit: number = 10) {
    const cacheKey = `Paginated:${page}:${limit}`;

    try {
      // Check Redis cache first
      if (this.redisClient) {
        const cached = await this.redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached); // Return cached data
        }
      }

      // Fetch from MongoDB if cache miss
      const skip = (page - 1) * limit;
      const data = await this.paginationModel
        .find()
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await this.paginationModel.countDocuments();

      const result = {
        page,
        limit,
        next: `/api/v1/pagination/?page=${page + 1}&limit=${limit}`,
        total,
        totalPages: Math.ceil(total / limit),
        data,
      };

      // Cache the result in Redis for 60 seconds
      if (this.redisClient) {
        await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 60);
      }

      return result;
    } catch (error) {
      this.logger.error('Error fetching paginated data', error);
      throw error;
    }
  }

  /**
   * Fetches all user data from the database.
   * Uses Redis caching to optimize performance for repeated requests.
   * @returns All users with total count
   */
  async getAllData() {
    try {
      // Check Redis cache first
      if (this.redisClient) {
        const cached = await this.redisClient.get('GetAllData');
        if (cached) {
          return JSON.parse(cached); // Return cached data
        }
      }

      // Fetch from MongoDB if cache miss
      const allUsers = await this.paginationModel.find().exec();
      const totalUsers = await this.paginationModel.countDocuments();
      const result = { totalUsers, data: allUsers };

      // Cache the result in Redis for 60 seconds
      if (this.redisClient) {
        await this.redisClient.set(
          'GetAllData',
          JSON.stringify(result),
          'EX',
          60,
        );
      }

      return result;
    } catch (error) {
      this.logger.error('Error fetching all users', error);
      throw error;
    }
  }

  /**
   * Fetches a single user by their unique ID.
   * @param id User's MongoDB ObjectId
   * @returns User document if found, otherwise null
   */
  async getUserById(id: string) {
    try {
      const foundUser = await this.paginationModel.findById(id);
      return foundUser;
    } catch (error) {
      this.logger.error('Error fetching user by id: ', id, error);
      throw error;
    }
  }

  /**
   * Fetches a single user by their unique email.
   * @param email User's Email.
   * @returns User document if found, otherwise null.
   */
  async getUserByEmail(email: string) {
    try {
      const foundUser = await this.paginationModel.findOne({ email });
      return foundUser;
    } catch (error) {
      this.logger.error('Error fetching user by id: ', email, error);
      throw error;
    }
  }

  /**
   * Fetches a single user by their name.
   * @param name User's Name.
   * @returns User document if found, otherwise null.
   */
  async getUserByName(name: string) {
    try {
      const foundUser = await this.paginationModel.findOne({ name });
      return foundUser;
    } catch (error) {
      this.logger.error('Error fetching user by id: ', name, error);
      throw error;
    }
  }
}
