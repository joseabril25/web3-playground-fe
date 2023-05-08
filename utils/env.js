const env = 'production';

import tastybonesABI from "../abi/tastybones.abi.json";

const config = {
  production: {
    tastyBonesContract: '0x1b79c7832ed9358E024F9e46E9c8b6f56633691B',
    tbABI: tastybonesABI,
    chainId: '0x1'
  },
  development: {
    tastyBonesContract: '0x1b79c7832ed9358E024F9e46E9c8b6f56633691B',
    tbABI: tastybonesABI,
    chainId: '0x4'
  }
}

export default config[env];
