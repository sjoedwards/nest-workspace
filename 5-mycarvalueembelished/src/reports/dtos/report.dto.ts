import { Expose, Transform } from 'class-transformer';
export class ReportDTO {
  @Expose()
  id: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  mileage: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  price: number;
  @Expose()
  approved: boolean;

  // In line transformation!
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
