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
// import { IReques
import { IRequest } from '../../types/request';
import { RoleGuard } from '../guards/role.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDTO } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { Roles } from '../decorators/roles.decorator';
import { RoleName } from '../../types/enums';

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
  @Roles(RoleName.Admin)
  @UseGuards(RoleGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
  // @Get()
  // getEstimate(@Query() query: GetEstimateDto) {
  //   return this.reportsService.createEstimate(query);
  // }
}
