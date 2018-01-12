import * as ora from 'ora'
import * as moment from 'moment'
import chalk from 'chalk'

export class Logger {
  private spinner: any
  constructor(private filePath: string) {
  }

  public info(str: string): Logger {
    this.initSpinner()
    this.spinner.info(chalk.bold.blue(this.prefixFilePath(str)))
    return this
  }

  public warn(str: string): Logger {
    this.initSpinner()
    this.spinner.warn(chalk.bold.yellow(this.prefixFilePath(str)))
    return this
  }

  public error(str: string): Logger {
    this.initSpinner()
    this.spinner.fail(chalk.bold.red(this.prefixFilePath(str)))
    return this
  }

  public start(str: string): Logger {
    this.initSpinner()
    this.spinner.start(this.prefixFilePath(str))
    return this
  }
  
  public success(str: string): Logger {
    this.initSpinner()
    this.spinner.succeed(chalk.green(this.prefixFilePath(str)))
    return this
  }

  public fail(str: string): Logger {
    this.initSpinner()
    this.spinner.fail(chalk.bold.red(this.prefixFilePath(str)))
    return this
  }

  public blank(lines = 2) {
    console.log('\n'.repeat(lines))
  }

  private prefixFilePath(str: string):string {
    const timeStr = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    return `[${timeStr}]--${this.filePath}--${str}`
  }

  private initSpinner(): void {
    if (!this.spinner) {
      this.spinner = ora()
    }
  }

}
