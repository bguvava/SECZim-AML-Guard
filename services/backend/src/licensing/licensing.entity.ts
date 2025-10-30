export class Licensing {
    id: number;
    entityName: string;
    breachType: string;
    status: 'pending'| 'resolved'| 'cancelled';
    dateReported: Date;
}