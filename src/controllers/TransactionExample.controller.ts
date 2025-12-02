import { Controller, Post } from '@nestjs/common';
import { TransactionExampleService } from 'src/services';

@Controller('transaction')
export class TransactionExampleController {
  constructor(private readonly txService: TransactionExampleService) {}

  @Post()
  runTransaction() {
    try {
      return this.txService.runTransactionExample();
    } catch (error) {
      console.log('Error: ', error);
    }
  }
}
