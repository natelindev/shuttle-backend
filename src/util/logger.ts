import { colors } from './consts';

/**
 * Enum for logger logLevel.
 * @readonly
 * @enum {string}
 */
export const enum logLevel {
  Debug = 'Debug', // only on dev env
  Info = 'Info', // get to stdout
  Warning = 'Warning', // get to stderr
  Error = 'Error' // get to stderr
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
  private static log(level: logLevel, componentName: string, message: any): void {
    const time = new Date();
    let color = colors.FgWhite;
    switch (level) {
      case logLevel.Debug:
        color = colors.FgCyan;
        break;
      case logLevel.Info:
        color = colors.FgGreen;
        break;
      case logLevel.Warning:
        color = colors.FgYellow;
        break;
      case logLevel.Error:
        color = colors.FgRed;
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
