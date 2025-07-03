// src/my-logger/my-logger.service.ts
import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class MyLoggerService extends ConsoleLogger {
  private readonly logFilePath: string;

  constructor(context?: string) {
    super(context ?? 'MyLoggerService');
    this.logFilePath = path.join(process.cwd(), 'logs', 'app.log');
    this.ensureLogDirectoryExists();
  }

  private async ensureLogDirectoryExists() {
    const logDir = path.dirname(this.logFilePath);
    try {
      await fs.mkdir(logDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create log directory ${logDir}:`, error);
    }
  }

  private async writeLogToFile(level: string, message: string, trace?: string) {
    const timestamp = new Date().toISOString();
    // දැන් stack trace එක ඇතුළත් කරන්නේ නැහැ
    let logEntry = `${timestamp}\t[${level.toUpperCase()}]\t${this.context ? `[${this.context}]\t` : ''}${message}\n`;

    // !!! පහත block එක සම්පූර්ණයෙන් ඉවත් කරන්න !!!
    // if (trace) {
    //   logEntry += `\t${trace.split('\n').join('\n\t')}\n`;
    // }

    try {
      await fs.appendFile(this.logFilePath, logEntry);
    } catch (error) {
      super.error(
        `Failed to write log to file ${this.logFilePath}: ${error.message}`,
      );
    }
  }

  log(message: string) {
    super.log(message);
    this.writeLogToFile('log', message);
  }

  error(message: string, trace?: string) {
    super.error(message, trace);
    // error method එකේදීත් trace එක send කරන්නේ නැහැ
    this.writeLogToFile('error', message);
  }

  warn(message: string) {
    super.warn(message);
    this.writeLogToFile('warn', message);
  }

  debug(message: string) {
    super.debug(message);
    this.writeLogToFile('debug', message);
  }

  verbose(message: string) {
    super.verbose(message);
    this.writeLogToFile('verbose', message);
  }
}
