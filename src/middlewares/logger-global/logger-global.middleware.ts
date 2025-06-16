import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerGlobalMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const reset = '\x1b[0m';
  const brightGreen = '\x1b[92m';
  const brightYellow = '\x1b[93m';
  const brightRed = '\x1b[91m';
  const brightPurple = '\x1b[95m';

  console.log(`${brightPurple}###--------------------------------------------### ${reset}`);
  const methodLength = req.method.length;
  const padding = Math.max(0, (36 - methodLength) / 2);
  const paddedMethod = ' '.repeat(padding) + req.method + ' '.repeat(padding);
  console.log(`${brightGreen}${paddedMethod}${reset}`);
  console.log(`${brightRed}Request Time:${reset} ${brightYellow}${new Date().toUTCString()}${reset}`);
  console.log(`${brightRed}Request IP:${reset} ${brightYellow}${req.ip}${reset}`);
  console.log(`${brightRed}Request URL:${reset} ${brightYellow}${req.originalUrl}${reset}`);
  console.log(`${brightRed}Request Params:${reset} ${brightYellow}${JSON.stringify(req.params)}${reset}`);
  console.log(`${brightRed}Request Query:${reset} ${brightYellow}${JSON.stringify(req.query)}${reset}`);
  console.log(`${brightRed}Request Body:${reset} ${brightYellow}${JSON.stringify(req.body)}${reset}`);
  console.log(`${brightRed}Request Headers:${reset} ${brightYellow}${JSON.stringify(req.headers)}${reset}`);
  console.log(`${brightPurple}###--------------------------------------------### ${reset}`);
  next();
}
