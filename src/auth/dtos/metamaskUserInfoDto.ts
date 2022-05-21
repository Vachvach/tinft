import { UnprocessableEntityException } from '@nestjs/common';
import { ValidatorProvider } from 'src/providers/validator.provider';
import { IMetamaskUserInfo } from '../interfaces/IMetamaskUserInfo';

export class MetamaskUserInfoDto implements IMetamaskUserInfo {
  publicAddress: string;
  signedAuthMessage: string;
  constructor(metamaskInfo: IMetamaskUserInfo) {
    const errorMessage = ValidatorProvider.isMetamaskUserInfo(metamaskInfo);
    if (errorMessage) {
      throw new UnprocessableEntityException(errorMessage);
    }
    this.publicAddress = metamaskInfo.publicAddress;
    this.signedAuthMessage = metamaskInfo.signedAuthMessage;
  }
}
