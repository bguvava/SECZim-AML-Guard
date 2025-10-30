import { Module } from '@nestjs/common';
import { LicensingController } from './licensing.controller';
import { LicensingService } from './sec-zim-aml/src/licensing/licensing.service';

@Module({
  controllers: [LicensingController],
  providers: [LicensingService],
})
export class LicensingModule {}
