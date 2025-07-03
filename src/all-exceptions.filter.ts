import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus, // HttpStatus import කරන්න
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library'; // නිවැරදි import path එක මෙයයි

type MyResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
    let responseBody: string | object = {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    };
    let logMessage: string; // Log කිරීමට අවශ්‍ය message එක
    let logStack: string | undefined = exception.stack; // Stack trace එක

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseBody = exception.getResponse();
      logMessage = `HTTP Exception: ${exception.message}`;
    } else if (exception instanceof PrismaClientValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422 Unprocessable Entity
      responseBody = {
        error: 'Prisma Client Validation Error',
        message: exception.message,
      };
      logMessage = `Prisma Validation Error: ${exception.message.split('\n')[0]}`; // පළමු line එක පමණක් log කරන්න
    } else {
      // මෙය Catch-all block එක
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        error: 'Internal Server Error',
        message: exception.message || 'An unexpected error occurred',
      };
      logMessage = `Unhandled Exception: ${exception.message || 'Unknown error'}`;
      // නොදන්නා exception එකකදී stack trace එකක් නොමැති වීමට ඉඩ ඇත
      if (!logStack && exception.stack) {
        logStack = exception.stack;
      }
    }

    const myResponse: MyResponseObject = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: responseBody,
    };

    // Client වෙත response යවන්න
    response.status(statusCode).json(myResponse);

    // Logger එකට send කරන්න
    // ඔබට logMessage එක string එකක් ලෙස දෙන්න පුළුවන්
    // නැත්නම් myResponse.response object එක JSON.stringify කරලා දෙන්නත් පුළුවන්
    this.logger.error(logMessage, logStack);
    // නැතහොත්: this.logger.error(`Exception caught: ${JSON.stringify(responseBody)}`, logStack);

    // NestJS හි default exception handling pipeline එකට exception එක යොමු කරන්න
    // මෙය වැදගත් වන්නේ NestJS හි inbuilt logger එක හෝ වෙනත් global filters වලටත් exception එක දැනගැනීමටයි.
    super.catch(exception, host);
  }
}
