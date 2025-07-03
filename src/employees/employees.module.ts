import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module'; // Importing AuthModule for FirebaseGuard
@Module({
  imports: [DatabaseModule, AuthModule], // Importing DatabaseModule to use DatabaseService
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
