/* eslint-disable no-console */
///
import colors from './color';

class Logger {
  componentName: string;
  logLevel: logLevel;

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  static log(logLevel: logLevel, componentName: string, message: string) {
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

  static raw(message: string) {
    console.log(message);
  }

  info(message: string) {
    Logger.log('Info', this.componentName, message);
  }

  error(message: string) {
    Logger.log('Error', this.componentName, message);
  }

  debug(message: string) {
    Logger.log('Debug', this.componentName, message);
  }

  warning(message: string) {
    Logger.log('Warning', this.componentName, message);
  }
}

const getLogger = componentName => new Logger(componentName);

export default getLogger;
