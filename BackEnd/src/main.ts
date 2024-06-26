import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  try {
    // Create the NestJS application instance
    const app = await NestFactory.create(AppModule);

    // Apply global validation pipe for request validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }));

    // Enable CORS with configuration from environment variables
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*', // Allow requests from this origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Enable credentials (e.g., cookies, authorization headers)
    });

    // Ensure PORT is defined in environment variables
    const port = process.env.PORT || 3000;
    if (!port) {
      throw new Error('PORT is not defined in the environment variables');
    }

    // Start listening on the defined port
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    // Handle any errors that occur during the bootstrap process
    console.error('Error during application bootstrap', error);
    process.exit(1); // Exit the process with a failure code
  }
}

// Start the application
bootstrap();
