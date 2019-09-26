import { colors } from './consts';

/**
 * Enum for logger logLevel.
 * @readonly
 * @enum {string}
 */
export const enum logLevel {
  Info = 'Info',
  Debug = 'Debug',
  Warning = 'Warning',
  Error = 'Error'
}

/**
 * custom Logger
 *
 */
class Logger {
  private componentName: string;

  /**
   * create a new Logger
   * @param {string} componentName Name of component
   */
  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * private internal log function
   */
  private static log(logLevel: logLevel, componentName: string, message: any) {
    const time = new Date();
    let color = colors.FgWhite;
    switch (logLevel) {
      case 'Info':
        color = colors.FgGreen;
        break;
      case 'Error':
        color = colors.FgRed;
        break;
      case 'Debug':
        color = colors.FgCyan;
        break;
      case 'Warning':
        color = colors.FgYellow;
        break;
      default:
        color = colors.FgWhite;
        break;
    }
    console.log(`${time.toISOString()} - ${color}[${logLevel}][${componentName}]` + ` ${message}${colors.Reset}`);
  }

  raw(message: any) {
    console.log(message);
  }

  info(message: any) {
    Logger.log(logLevel.Info, this.componentName, message);
  }

  error(message: any) {
    Logger.log(logLevel.Error, this.componentName, message);
  }

  debug(message: any) {
    Logger.log(logLevel.Debug, this.componentName, message);
  }

  warning(message: any) {
    Logger.log(logLevel.Warning, this.componentName, message);
  }
}

const getLogger = (componentName: string) => new Logger(componentName);

export default getLogger;
