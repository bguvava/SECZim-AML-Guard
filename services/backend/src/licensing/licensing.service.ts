import { Injectable } from '@nestjs/common';
import { Licensing } from './licensing.entity';

@Injectable()
export class LicensingService {
  private licenses: Licensing[] = [];
  private idCounter = 1;

  // Create a new licensing breach
  create(breachData: Omit<Licensing, 'id' | 'dateReported'>): Licensing {
    const newBreach: Licensing = {
      id: this.idCounter++,
      dateReported: new Date(),
      ...breachData,
    };
    this.licenses.push(newBreach);
    return newBreach;
  }

  // Get all breaches
  findAll(): Licensing[] {
    return this.licenses;
  }

  // Get one breach by ID
  findOne(id: number): Licensing | undefined {
    return this.licenses.find((b) => b.id === id);
  }

  // Cancel a license (update status)
  cancel(id: number): Licensing | undefined {
    const breach = this.findOne(id);
    if (breach) breach.status = 'cancelled';
    return breach;
  }
}
