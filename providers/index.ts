import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class SeznamDriverProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { SeznamDriver } = await import('../src/SeznamDriver')

    Ally.extend('yourdriver', (_, __, config, ctx) => {
      return new SeznamDriver(ctx, config)
    })
  }
}
