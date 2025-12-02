import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { User } from 'src/schemas';

@Injectable()
export class TransactionExampleService {
  private readonly logger = new Logger(TransactionExampleService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async runTransactionExample() {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdUser = await this.userModel.create(
        [
          {
            name: 'Transactional User',
            email: 'trx_user@test.com',
            age: 25,
          },
        ],
        { session },
      );

      await this.userModel.updateOne(
        { email: 'user1@test.com' },
        { $set: { age: 30 } },
        { session },
      );

      await this.userModel.deleteOne({ email: 'user50@test.com' }, { session });

      await session.commitTransaction();

      return {
        success: true,
        message: 'Transaction committed successfully.',
        createdUser,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Transaction failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
