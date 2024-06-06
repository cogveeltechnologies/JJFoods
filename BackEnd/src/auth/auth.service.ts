import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './dtos/signup.dto';
import { LoginOtpDto } from './dtos/loginOtp.dto';
import { SignupOtp } from './schemas/signupOtp.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from './dtos/login.dto';
import { UpdateProfileOtpDto } from './dtos/updateProfileOtp.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { Address } from './schemas/address.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
const admin = require("../utils/firebase/firebaseInit")
const axios = require('axios');
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SignupOtp.name) private signupOtpModel: Model<SignupOtp>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private configService: ConfigService) {

  }
  bucket = admin.storage().bucket();
  sendMail(email: string, otp: number): void {
    this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('EMAIL'),
      subject: 'Welcome!!!',
      text: 'welcome',
      html: `<b>Your otp is ${otp}</b>`


    })

  }

  smsGatewayOtp(body) {
    // Replace the placeholders with actual values
    const apiKey = this.configService.get<string>('SMS_KEY');
    const phoneNumber = body.phoneNumber;
    const otp = body.otp;
    const templateName = 'OTP';

    // Construct the URL
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/${otp}/${templateName}`;
    // https://2factor.in/API/V1/fcd66483-72d5-11eb-a9bc-0200cd936042/SMS/8803005904/12345/OTP

    // Make the GET request using fetch
    fetch(url, {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }

  async smsGatewayVerify(body) {
    const apiKey = this.configService.get<string>('SMS_KEY');
    const phoneNumber = body.phoneNumber;
    const otp = body.otp;


    // Construct the URL
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otp}`;

    try {
      // Make the GET request using fetch
      const response = await fetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      return data
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }

  }

  async signupOtp(signupOtpDto) {
    try {
      const existingUser = await this.userModel.findOne({ emailId: signupOtpDto.emailId });
      if (existingUser) {
        const isActive = existingUser.isActive
        if (isActive) {
          throw new Error("User with this email already exists.");

        }
        else {
          existingUser.isActive = true;
          await existingUser.save();
          throw new Error("your account has been reactivated. Please login.");
        }

      }
      const existingOtp = await this.signupOtpModel.findOne({ emailId: signupOtpDto.emailId })
      let otp = this.generateOtp();
      if (existingOtp) {
        await this.signupOtpModel.findOneAndUpdate({ emailId: signupOtpDto.emailId }, { otp })

      }
      else {
        const newUser = new this.signupOtpModel({
          emailId: signupOtpDto.emailId,
          otp
        })
        await newUser.save();
      }

      const body = {
        phoneNumber: signupOtpDto.phoneNumber,
        otp

      }
      this.smsGatewayOtp(body)
      //email
      this.sendMail(signupOtpDto.emailId, otp)

      return { "message": "otp sent" }

    } catch (error) {
      // Handle errors
      throw new Error(`Failed to sign up: ${error.message}`);

    }
  }

  generateOtp() {
    // Generate a random validation code
    const validationCode = Math.floor(10000 + Math.random() * 90000 - 1);

    // Return the validation code
    return validationCode;

  }
  async signUp(signupDto: SignupDto) {
    try {
      // Check if user with the same email already exists
      const existingUser = await this.userModel.findOne({ emailId: signupDto.emailId });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }
      // otp check
      const user = await this.signupOtpModel.findOne({ emailId: signupDto.emailId })
      if (!user) {
        throw new Error("User not exists");
      }
      if (user.otp !== signupDto.otp) {
        throw new Error('invalid otp')
      }
      const resp = await this.smsGatewayVerify({
        phoneNumber: signupDto.phoneNumber,
        otp: signupDto.otp
      })
      console.log("response-----------", resp)
      if (resp['Status'] === "Error") {
        throw new Error('invalid otp')
      }



      // Create a new user instance
      const createdUser = new this.userModel({
        name: signupDto.name, emailId: signupDto.emailId, phoneNumber: signupDto.phoneNumber
      });

      // Save the user to the database
      await createdUser.save();
      return createdUser;


    } catch (error) {
      // Handle errors
      throw new Error(`Failed to sign up: ${error.message}`);
    }
  }
  async loginOtp(loginOtpDto: LoginOtpDto) {
    try {
      // Find user by phone number
      // console.log("first one")
      const user = await this.userModel.findOne({ phoneNumber: loginOtpDto.phoneNumber });
      // console.log("second one")
      if (!user) {
        throw new Error('User not found');
      }
      if (user.isActive === false) {
        throw new Error('reactivate account');
      }

      // If user not found, throw an error





      // Return the validation code



      let otp = this.generateOtp();

      await this.signupOtpModel.findOneAndUpdate({ emailId: user.emailId }, { otp })




      const body = {
        phoneNumber: loginOtpDto.phoneNumber,
        otp

      }
      this.smsGatewayOtp(body)


      this.sendMail(user.emailId, otp)

      return { "data": "otp sent" }
    } catch (error) {
      // Handle errors
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto) {


    const user = await this.userModel.findOne({ phoneNumber: loginDto.phoneNumber })
    const userOtp = await this.signupOtpModel.findOne({ emailId: user.emailId })
    // console.log(user)
    if (!user) {
      throw new Error("User not exists");
    }
    const resp = await this.smsGatewayVerify({
      phoneNumber: loginDto.phoneNumber,
      otp: loginDto.otp
    })
    console.log("response-----------", resp)
    if (resp['Status'] === "Error") {
      throw new Error('invalid otp')
    }
    if (userOtp.otp !== loginDto.otp) {
      throw new Error('invalid otp')
    }

    return user;

  }

  async updatePhoneNumber(body) {
    try {
      if (!body.phoneNumber) {
        throw new Error('phone number is required')
      }
      // Check if user with the same phoneNumber already exists
      const existingUser = await this.userModel.findOne({ phoneNumber: body.phoneNumber });
      if (existingUser) {
        throw new Error("User with this phone number already exists.");
      }

      let otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ emailId: body.emailId }, { otp })
      this.sendMail(body.emailId, otp)

      return { "data": "otp sent" }

    } catch (error) {
      // Handle errors
      throw new Error(`Login failed: ${error.message}`);

    }
  }

  async updateEmailId(updateProfileOtpDto: UpdateProfileOtpDto) {
    try {

      if (!updateProfileOtpDto.emailId) {
        throw new Error('emailId is required')
      }
      // Check if user with the same email already exists
      const existingUser = await this.userModel.findOne({ emailId: updateProfileOtpDto.emailId });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      let otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ phoneNumber: updateProfileOtpDto.phoneNumber }, { otp })
      this.sendMail(updateProfileOtpDto.emailId, otp)

      return "otp sent"

    } catch (error) {
      // Handle errors
      throw new Error(`Login failed: ${error.message}`);

    }

  }
  async uploadImage(image) {
    try {
      // if (!image || !image.originalname) {
      //   throw new Error('Image file not provided');
      // }
      // console.log(image)
      const fileName = image.originalname;
      const fileUpload = this.bucket.file(fileName);
      const fileStream = image.buffer; // Use buffer for file data

      // Upload image to Firebase Storage
      await fileUpload.save(fileStream, {
        metadata: {
          contentType: image.mimetype
        }
      });

      // Make the image publicly accessible
      await fileUpload.makePublic();

      // Get public URL for the image
      const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-3024' }); // Adjust the expiration date as needed

      return url;
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw error;
    }
  }

  async updateProfile(updateProfileDto: any, file) {
    const user = await this.userModel.findOne({ phoneNumber: updateProfileDto.phoneNumber })
    // console.log(updateDto.phoneNumber)
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { phoneNumber: updateProfileDto.phoneNumber },
      { $set: updateProfileDto },
      { new: true } // Return the updated document
    )
    if (file) {

      const imageUrl = await this.uploadImage(file);

      updatedUser['imageUrl'] = imageUrl;
    }

    await updatedUser.save()
    return updatedUser;


  }

  async deleteProfile(body) {
    const user = await this.userModel.findById(body.userId);

    // Check if the user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's isActive status and reason
    user.isActive = false;
    user.reason = body.reason;

    // Save the updated user
    await user.save();

    return user;

  }
  // address

  async addAddress(addressDto: any) {
    // console.log("smsssssskeyyyyyy", this.configService.get<string>('SMS_KEY'))
    console.log(addressDto)
    if (addressDto.isDefault) {

      await this.addressModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });
    }
    const createdAddress = new this.addressModel(addressDto);
    await createdAddress.save();
    return createdAddress;
  }

  async getAddresses(id: any) {

    const addresses = await this.addressModel.find({ user: id });
    return addresses;
  }
  async getAddress(id: any) {

    const address = await this.addressModel.findOne({ _id: id })
    return address;
  }
  async updateAddress(updateAddressDto, id) {
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });

    }
    const updatedAddress = await this.addressModel.findOneAndUpdate({ _id: id }, updateAddressDto, { new: true });
    return await this.getAddresses(updatedAddress.user)
  }

  async deleteAddress(id, userId) {
    await this.addressModel.deleteOne({ _id: id })

    const arr = await this.addressModel.find()
    const length = arr.length;


    if (length == 1) {
      await this.addressModel.updateMany({}, { $set: { isDefault: true } });

    }

    return await this.getAddresses(userId)
  }

  async updateState(id, userId) {
    console.log(id)
    await this.addressModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });

    await this.addressModel.updateOne({ _id: id }, { $set: { isDefault: true } })

    return await this.getAddresses(userId)



  }

  async automaticAddress(ip) {



    const options = {
      method: 'GET',
      url: 'http://ipwho.is/' + ip

    }


    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data
    } catch (error) {
      throw new Error("enter valid ip")
      console.error(error);
    }
  }

}
