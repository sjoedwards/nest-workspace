import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';
import { IRequest } from 'types/request';
import { AdminGuard } from '../guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
// import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDTO } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JWTAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/:id')
  @Serialize(ReportDTO)
  getReportById(@Param('id') id: string) {
    return this.reportsService.getById(id);
  }
  @Post()
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDto, @Request() request: IRequest) {
    return this.reportsService.create(body, request.user);
  }
  // // Todo - RBAC from the authorization tutorial
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
  // @Get()
  // getEstimate(@Query() query: GetEstimateDto) {
  //   return this.reportsService.createEstimate(query);
  // }
}
