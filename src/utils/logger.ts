import { Locale } from '../types';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const LEVEL_COLORS: Record<LogLevel, string> = {
  info:  '\x1b[36m',  // cyan
  warn:  '\x1b[33m',  // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[90m',  // gray
};
const RESET = '\x1b[0m';

function log(level: LogLevel, message: string, ...args: any[]) {
  const ts = new Date().toISOString();
  const color = LEVEL_COLORS[level];
  console.log(`${color}[${ts}] [${level.toUpperCase()}] ${message}${RESET}`, ...args);
}

export const logger = {
  info:  (msg: string, ...args: any[]) => log('info',  msg, ...args),
  warn:  (msg: string, ...args: any[]) => log('warn',  msg, ...args),
  error: (msg: string, ...args: any[]) => log('error', msg, ...args),
  debug: (msg: string, ...args: any[]) => log('debug', msg, ...args),
};
