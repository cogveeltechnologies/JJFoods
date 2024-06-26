// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Method to retrieve a greeting message
  getHello(): string {
    // Return a greeting message
    return 'Hello World!';
  }
}
