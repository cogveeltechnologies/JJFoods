import { Module, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { SignupOtp, SignupOtpSchema } from './schemas/signupOtp.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddressSchema } from './schemas/address.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,

    HttpModule,
    MongooseModule.forFeature([{
      name: 'User', schema: UserSchema

    }, {
      name: 'Address', schema: AddressSchema
    }, {
      name: 'SignupOtp', schema: SignupOtpSchema
    }]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    // MailerModule.forRoot({

    //   transport: {
    //     host: 'smtp.gmail.com',
    //     auth: {
    //       user: 'husbanraina123@gmail.com',
    //       pass: 'oibu lxjx fqqb bwnt'
    //     }

    //   }
    // })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
