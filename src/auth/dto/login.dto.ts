import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: 'cedula o id del usuario' })
  cedula: string;
  @ApiProperty({ description: 'Contraseña del usuario' })
  password: string;
}
