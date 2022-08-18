import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { DiskController } from './disk.controller';
import { PowerModule } from 'src/power/power.module';

@Module({
  providers: [DiskService],
  controllers: [DiskController],
  imports: [PowerModule],
  exports: [DiskService],
})
export class DiskModule {}
