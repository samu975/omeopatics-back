import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(cedula: string, password: string): Promise<any> {
    const user = await this.usersService.findByCedula(cedula);
    if (user && password === user.phone) {
      const userObject = user.toObject();
      delete userObject.password;
      return userObject;
    }
    return null;
  }

  async login(user: any) {
    const payload = { cedula: user.cedula, sub: user._id, role: user.role };
    return {
      message: 'Login exitoso',
      status: 200,
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          _id: user._id,
          name: user.name,
          cedula: user.cedula,
          phone: user.phone,
          role: user.role,
        },
      }
     
    };
  } 
}
