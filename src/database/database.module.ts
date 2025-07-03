import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService] // Exporting DatabaseService so it can be used in other modules
})
export class DatabaseModule {}
