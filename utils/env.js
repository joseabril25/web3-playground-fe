const env = 'production';

import boneDevABI from "./approving-bone-abi.dev.json";
import corgiDevABI from "./approving-corgis-abi.dev.json";
import tastybonesABI from "./tasty-bones-abi.dev.json";
import tastybonesProdABI from "./tasty-bones-abi.prod.json";

import boneProdABI from "./approving-bone-abi.prod.json";
import corgiProdABI from "./approving-corgis-abi.prod.json";

const config = {
  production: {
    boneContract: '0x77C7f7Dc1b592E884966f0dc4AE0fFB93CBA1a7e',
    boneABI: boneProdABI,
    corgiContract: '0x4F1B1306E8bd70389d3C413888a61BB41171a0Bc',
    corgiABI: corgiProdABI,
    tastyBonesContract: '0xB11bFefB6E6A3Bd922A3b934C870EdAd396EcAc8',
    tbABI: tastybonesProdABI,
  },
  development: {
    boneContract: '0x00f54A797d13F868b2d784D98b5B270Ff4e9aFA6',
    boneABI: boneDevABI,
    corgiContract: '0x10F5A77Fc1324d989810823eaDa2CfE8C01716B0',
    corgiABI: corgiDevABI,
    tastyBonesContract: '0x40e45414C5A19598198398Ac1Fa0A3E0a19d04A0',
    tbABI: tastybonesABI,
  }
}

export default config[env];
