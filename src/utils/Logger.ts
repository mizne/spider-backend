import * as ora from 'ora'
import * as moment from 'moment'
import chalk from 'chalk'

export class Logger {
  private spinner: any
  constructor(private filePath: string) {
  }

  info(str: string): Logger {
    this.initSpinner()
    this.spinner.info(chalk.bold.blue(this.prefixFilePath(str)))
    return this
  }

  warn(str: string): Logger {
    this.initSpinner()
    this.spinner.warn(chalk.bold.yellow(this.prefixFilePath(str)))
    return this
  }

  error(str: string): Logger {
    this.initSpinner()
    this.spinner.fail(chalk.bold.red(this.prefixFilePath(str)))
    return this
  }

  start(str: string): Logger {
    this.initSpinner()
    this.spinner.start(this.prefixFilePath(str))
    return this
  }
  
  success(str: string): Logger {
    this.initSpinner()
    this.spinner.succeed(chalk.green(this.prefixFilePath(str)))
    return this
  }

  fail(str: string): Logger {
    this.initSpinner()
    this.spinner.fail(chalk.bold.red(this.prefixFilePath(str)))
    return this
  }

  prefixFilePath(str: string):string {
    const timeStr = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    return `[${timeStr}]--${this.filePath}--${str}`
  }

  initSpinner(): void {
    if (!this.spinner) {
      this.spinner = ora()
    }
  }

}
