import { Logger, Module } from "@nestjs/common";
import { PaginationExampleController } from "src/controllers";
import { DatabaseProvider } from "src/provider";
import { PaginationExampleService } from "src/services";

@Module({
    imports: [],
    controllers: [PaginationExampleController],
    providers: [PaginationExampleService, DatabaseProvider, Logger],
    exports: [PaginationExampleService],
})
export class PaginationExampleModule {}