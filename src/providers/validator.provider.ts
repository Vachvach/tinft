import { isAddress, isHex } from 'web3-utils';

export class ValidatorProvider {
  static isMetamaskUserInfo(data: any): string {
    let errorMessage = '';
    if (!isAddress(data.publicAddress as string)) {
      errorMessage = 'publicAddress must be ethereum public address';
    }
    if (!isHex(data.signedAuthMessage as string)) {
      errorMessage = errorMessage
        ? errorMessage + ' code must be hex'
        : 'code must be hex';
    }
    return errorMessage;
  }
}
