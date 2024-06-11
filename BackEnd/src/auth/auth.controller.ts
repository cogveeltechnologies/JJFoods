import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginOtpDto } from './dtos/loginOtp.dto';
import { SignupOtpDto } from './dtos/signupOtp.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateProfileOtpDto } from './dtos/updateProfileOtp.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('/check')
  check(@Body() body) {
    return this.authService.check(body)
  }

  @Post('/signupOtp')
  signupOtp(@Body() signupOtpDto: SignupOtpDto) {
    console.log(signupOtpDto)

    return this.authService.signupOtp(signupOtpDto)


  }
  @Post('/signup')
  signUp(@Body() signupDto: SignupDto) {
    console.log(signupDto)
    return this.authService.signUp(signupDto);
  }

  @Post('/loginOtp')
  loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    // console.log("first")
    return this.authService.loginOtp(loginOtpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {



    return this.authService.login(loginDto)
  }

  @Post('/updatePhoneNumber')
  updatePhoneNumber(@Body() body) {
    return this.authService.updatePhoneNumber(body)
  }

  @Post('/updateEmailId')
  updateEmailId(@Body() updateProfileOtpDto: UpdateProfileOtpDto) {
    return this.authService.updateEmailId(updateProfileOtpDto)
  }

  @Put('/updateProfile')
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(@Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File) {
    console.log(updateProfileDto, file)

    return this.authService.updateProfile(updateProfileDto, file)
  }

  @Delete('/delete')
  deleteProfile(@Body() body) {
    console.log(body)

    return this.authService.deleteProfile(body)
  }

  // address
  @Post('/addAddress')
  addAddress(@Body() addressDto: any) {

    return this.authService.addAddress(addressDto);
  }

  @Get('/getAddresses/:id')
  getAddresses(@Param('id') id: string) {

    return this.authService.getAddresses(id);
  }

  @Get('getAddress/:id')
  getAddress(@Param('id') id: string) {
    return this.authService.getAddress(id)
  }

  @Put('/updateAddress/:id')
  updateAddress(@Body() updateAddressDto, @Param('id') id: string) {

    return this.authService.updateAddress(updateAddressDto, id);
  }

  @Delete('/deleteAddress/:id')
  deleteAddress(@Param('id') id: string, @Body() body) {
    console.log(body, id)

    return this.authService.deleteAddress(id, body.userId)
  }

  @Put('/updateState/:id')
  async updateState(@Param('id') id: string, @Body() body) {

    const response = await this.authService.updateState(id, body.userId)
    console.log(response)

    return response
  }

  @Get('/automaticAddress/:ip')
  automaticAddress(@Param('ip') ip) {
    return this.authService.automaticAddress(ip)
  }




}
