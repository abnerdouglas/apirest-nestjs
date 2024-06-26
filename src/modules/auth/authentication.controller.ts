import { Controller, Post, Body } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() { email, password }: AuthDTO) {
    return this.authenticationService.login(email, password);
  }
}