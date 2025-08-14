type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface ILogger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export default class Logger implements ILogger {
  private context?: string;
  private levelPriority: Record<LogLevel, number> = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
  };

  private currentLevel: LogLevel;

  constructor(context?: string, level: LogLevel = 'INFO') {
    this.context = context;
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    return `${timestamp} ${level} ${ctx}: ${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (!this.shouldLog('DEBUG')) return;
    console.debug(this.formatMessage('DEBUG', message), ...args);
  }

  info(message: string, ...args: any[]) {
    if (!this.shouldLog('INFO')) return;
    console.info(this.formatMessage('INFO', message), ...args);
  }

  warn(message: string, ...args: any[]) {
    if (!this.shouldLog('WARN')) return;
    console.warn(this.formatMessage('WARN', message), ...args);
  }

  error(message: string, ...args: any[]) {
    if (!this.shouldLog('ERROR')) return;
    console.error(this.formatMessage('ERROR', message), ...args);
  }

  setLevel(level: LogLevel) {
    if (!this.levelPriority[level]) {
      throw new Error(`Invalid log level: ${level}`);
    }
    this.currentLevel = level;
  }
}

export const globalLogger = new Logger('OTP Api');
