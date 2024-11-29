import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.password) {
      throw new BadRequestException('Password is required');
    }

    value.password = await bcrypt.hash(value.password, 10);
    return value;
  }
}
