import { Controller, Get, Post, Param, Body, Patch, BadRequestException } from '@nestjs/common';
import { LicensingService } from './licensing.service';
import { Licensing } from './licensing.entity';

@Controller('licensing')
export class LicensingController {
  constructor(private readonly licensingService: LicensingService) {}

  // Create a new licensing breach
  @Post()
  async create(@Body() data: Omit<Licensing, 'id' | 'dateReported'>) {
    console.log('🟢 Incoming POST body:', data);

    // ✅ Guard against undefined body
    if (!data) {
      throw new BadRequestException('No request body received. Ensure Content-Type is application/json');
    }

    // ✅ Apply defaults
    const newData = {
      entityName: data.entityName ?? '',
      entityId: data.entityId ?? '',
      breachType: data.breachType ?? '',
      severity: data.severity ?? '',
      description: data.description ?? '',
      status: data.status ?? 'active',
      penalty: data.penalty ?? null,
      recommendation: data.recommendation ?? null,
    };

    return this.licensingService.create(newData);
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
