import { Module } from '@nestjs/common';
import { LicensingModule } from './licensing/licensing.module';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule, LicensingModule], // ✅ Use PrismaModule here
})
export class AppModule {}
