import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { LicensingService } from './sec-zim-aml/src/licensing/licensing.service';
import { Licensing } from './licensing.entity';

@Controller('licensing')
export class LicensingController {
  constructor(private readonly licensingService: LicensingService) {}

  @Post()
  create(@Body() data: Omit<Licensing, 'id' | 'dateReported'>) {
    return this.licensingService.create(data);
  }

  @Get()
  findAll() {
    return this.licensingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensingService.findOne(Number(id));
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.licensingService.cancel(Number(id));
  }
}
