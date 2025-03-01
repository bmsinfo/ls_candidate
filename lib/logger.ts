'use server'

import {
  createLogToBackend,
  sendLogToBackend,
} from '@/app/serverActions/logger';

export interface LogDetails {
  browser: string;
  camera: string;
  internet_speed: string;
  created_at: string;
  status:string;
  event: string;
  message: string;
  reason: string
  data : any;
  // [key: string]: any; // Allow additional properties
}
interface LoggerConfig {
  session: number;
  log:  Partial<LogDetails>;
}

const defaultLogValues: LogDetails = {
  browser: '',
  camera: '',
  internet_speed: '',
  created_at: '',
  status: '',
  event: '',
  message: '',
  reason: '',
  data: ''
};

let loggerConfig: LoggerConfig | null = null;
let log: LogDetails | Record<string, any> = defaultLogValues;


console.log("loggerConfig on load ----", { loggerConfig });

export async function configureLogger(config: LoggerConfig) {
  loggerConfig = config;
  console.log('loggerConfig on configure --', { loggerConfig });
  log = { ...defaultLogValues, ...config.log }; // Initialize the log with the initial log details
  await createLogToBackend(config.session, log);
}

function logger(...args: any): void {
  args.unshift('[stream.new]');
  console.log(...args); // eslint-disable-line no-console
}

logger.warn = function loggerWarn(...args: any) {
  args.unshift('[stream.new]');
  console.warn(...args); // eslint-disable-line no-console
};

logger.error = function loggerError(...args: any) {
  args.unshift('[stream.new]');
  console.warn(...args); // eslint-disable-line no-console
};

logger.log = function loggerLog(newLog: Partial<LogDetails>, ...args: any) {
  // Merge new log data with existing log
  log = { ...log, ...newLog };
  const message = `[stream.new] ${args.join(' ')}`;
  console.log(`%c${message}`, 'color: green'); // eslint-disable-line no-console

  sendLogToBackend(loggerConfig?.session || undefined ,log);
};

export async function loggerAPI(newLog: Partial<LogDetails>, ...args: any) {
  console.log('loggerConfig on configure --', { loggerConfig });
    // Define keys that should be reset if not passed
    const keysToReset = ['event', 'message', 'reason', 'data'];
   
      // Create a new log object with default values for specified keys
      const resetLog = keysToReset.reduce((acc: Record<string, any>, key) => {
        acc[key as keyof LogDetails] = key in newLog ? newLog[key as keyof LogDetails] : '';
        return acc;
      }, {});
  log = { ...log, ...newLog,...resetLog };
  sendLogToBackend(loggerConfig?.session || undefined, log);
}

export default logger;