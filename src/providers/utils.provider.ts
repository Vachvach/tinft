import { randomInt } from 'crypto';

import { bufferToHex } from 'ethereumjs-util';

export class UtilsProvider {
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: Record<string, any>,
  ): T;

  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: Record<string, any>,
  ): T[];

  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options?: Record<string, any>,
  ): T | T[] {
    if (Array.isArray(entity)) {
      return entity.map((u) => new model(u, options));
    }

    return new model(entity, options);
  }

  static generateNonce(): string {
    return randomInt(100_000, 99_999).toString();
  }

  static getMetamaskAuthMessage(publicAddress: string, nonce: string): string {
    const message = `
      Welcome to ${process.env.APP_NAME}!
      Click "Sign" to sign in. No password needed!
      This request will not trigger a blockchain transaction or cost any gas fees.
      Your authentication status will be reset after 24 hours.
      Wallet address:
      ${publicAddress}
      Nonce:
      ${nonce}
    `;

    return bufferToHex(Buffer.from(message, 'utf8'));
  }
}
