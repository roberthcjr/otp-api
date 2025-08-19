export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export default interface ILogger {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

type LogFunction = (message: string, ...args: any[]) => void;
