// default way of displaying a user to the outside would

import { Expose } from 'class-transformer';

export class UserDto {
  // Expose shows decorators that need to be exposed
  @Expose()
  id: number;

  @Expose()
  email: string;
}
