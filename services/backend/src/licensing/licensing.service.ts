import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LicenseBreach } from '@prisma/client';

@Injectable()
export class LicensingService {
  constructor(private prisma: PrismaService) {}

  // Create a new license breach record
  async create(data: Omit<LicenseBreach, 'id' | 'dateReported'>): Promise<LicenseBreach> {
    return this.prisma.licenseBreach.create({
      data: {
        ...data,
        status: data.status ?? 'active', // default if missing
        dateReported: new Date(),
      },
    });
  }

  async findAll(): Promise<LicenseBreach[]> {
    return this.prisma.licenseBreach.findMany({ orderBy: { dateReported: 'desc' } });
  }

  async findOne(id: number): Promise<LicenseBreach | null> {
    return this.prisma.licenseBreach.findUnique({ where: { id } });
  }

  async cancel(id: number): Promise<LicenseBreach | null> {
    return this.prisma.licenseBreach.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async updateActions(
    id: number,
    penalty?: number,
    recommendation?: string,
  ): Promise<LicenseBreach | null> {
    return this.prisma.licenseBreach.update({
      where: { id },
      data: { penalty, recommendation },
    });
  }

  async findActive(): Promise<LicenseBreach[]> {
    return this.prisma.licenseBreach.findMany({
      where: { status: 'active' },
      orderBy: { dateReported: 'desc' },
    });
  }

  async getStats() {
    const [total, active, cancelled, avg] = await Promise.all([
      this.prisma.licenseBreach.count(),
      this.prisma.licenseBreach.count({ where: { status: 'active' } }),
      this.prisma.licenseBreach.count({ where: { status: 'cancelled' } }),
      this.prisma.licenseBreach.aggregate({ _avg: { penalty: true } }),
    ]);
    return { total, active, cancelled, avgPenalty: avg._avg.penalty };
  }
}
