import { Page, Browser, launch } from 'puppeteer'
import * as uuid from 'uuid'
import { log } from './decorators'

const pageConfig = {
  pageUrl: 'http://hkpic.net',
  usernameSelector: '#ls_username',
  passwordSelector: '#ls_password',
  loginBtnSelector: 'button[type="submit"]',
  loginSuccessSelector: '#extcreditmenu',
  signInAnchorSelector: 'a font[color="red"]',
  signInBtnSelector: '#fwin_dsu_paulsign button',
  defaultStatusSelector: '#kx',
  pointsAnchorSelector: '#extcreditmenu',
  pointsViewSelector: '.xi1.cl'
}

export interface SignInResult {
  lastPoints: string
  currentPoints: string
  status: string
  name: string
}

export default class Main {
  private browser: Browser
  private page: Page
  private lastPoints: string
  private currentPoints: string
  private status = false
  constructor(private name: string, private password: string) {}

  public async run() {
    try {
      await this.setUp()
      await this.loadPage()
      await this.login()
      this.lastPoints = await this.checkPoint()
      const hasFoundSignInAnchor = await this.findSignInAnchor()
        .then(() => true)
        .catch(() => false)
      if (hasFoundSignInAnchor) {
        await this.signIn()
        this.status = true
        this.currentPoints = await this.checkPoint()
      }
    } finally {
      await this.tearDown()
    }

    return {
      lastPoints: this.lastPoints,
      currentPoints: this.currentPoints,
      status: this.status
    }
  }

  @log()
  private async setUp() {
    this.browser = await launch({
      headless: true,
    })
    this.page = await this.browser.newPage()

    await this.page.setViewport({
      width: 1024,
      height: 768
    })
  }

  @log()
  private async tearDown() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  @log()
  private async loadPage(url = pageConfig.pageUrl, timeout = 60 * 1000) {
    await this.page.goto(url, { timeout, waitUntil: 'domcontentloaded' })
  }

  @log()
  private async login(
    usernameSelector = pageConfig.usernameSelector,
    passwordSelector = pageConfig.passwordSelector,
    btnSelector = pageConfig.loginBtnSelector
  ) {
    await this.page.type(usernameSelector, this.name, { delay: 5e2 })
    await this.page.type(passwordSelector, this.password, { delay: 5e2 })

    await this.page.click(btnSelector, { delay: 5e2 })
    await this.page.waitForSelector(pageConfig.loginSuccessSelector, {
      timeout: 1e4
    })
  }

  @log()
  private async findSignInAnchor(
    singInSelector = pageConfig.signInAnchorSelector
  ) {
    await this.page.waitForSelector(singInSelector, { timeout: 5e3 })
  }

  @log()
  private async signIn(
    singInSelector = pageConfig.signInAnchorSelector,
    signInBtnSelector = pageConfig.signInBtnSelector,
    statusSelector = pageConfig.defaultStatusSelector
  ) {
    await this.page.click(singInSelector, { delay: 5e2 })
    await this.findSignInBtn(signInBtnSelector)

    await this.page.click(statusSelector, { delay: 5e2 })
    await this.page.click(signInBtnSelector, { delay: 5e2 })
    await this.page.waitFor(8e2)
    await this.screenshot()
  }

  private async findSignInBtn(selector: string) {
    await this.page.waitForSelector(selector, { timeout: 1e4 })
  }

  @log()
  private async checkPoint(
    pointsAnchorSelector = pageConfig.pointsAnchorSelector,
    pointsViewSelector = pageConfig.pointsViewSelector
  ) {
    await this.page.click(pointsAnchorSelector, { delay: 5e2 })
    await this.page.waitForSelector(pointsViewSelector, { timeout: 1e4 })
    const pointHandle = await this.page.$(pointsViewSelector)
    const point = await this.page.evaluate(
      (p: HTMLElement) => p.textContent,
      pointHandle
    )
    await this.screenshot()
    return point.replace(/\D*/g, '')
  }

  private async screenshot() {
    const relativePath = `./screenshot/${this.name}@@${uuid.v4()}.png`
    await this.page.screenshot({
      path: relativePath,
      fullPage: true
    })
  }
}
