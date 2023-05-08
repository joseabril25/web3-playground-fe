import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { solidityCompiler } from '@agnostico/browser-solidity-compiler';
import { ABI } from '../contracts/Eldr';

const deployContract = async(abi, bytecode) => {
  if(typeof window !== undefined && typeof window.ethereum !== undefined) {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) throw new Error('No provider');
      const library = new ethers.providers.Web3Provider(provider);
      const signer = library.getSigner();
    
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy(); // contract argument 2
      await contract.deployed();
      console.log("🚀 ~ file: contract-deploy.js ~ line 16 ~ deployContract ~ contract", contract.address)
    } catch (error) {
      console.log("🚀 ~ file: contract-deploy.js:18 ~ deployContract ~ error", error)
      
    }
  }
  
}

export const generateUsingSource = async (source) => {
  if(typeof window !== undefined && typeof window.ethereum !== undefined) {
    const compiledData = await compile(source, 'rekt');
    await deployContract(compiledData.abi, compiledData.bytecode);
  }
};

const compile = async (sourceCode, contractName) => {
  if(typeof window !== undefined && typeof window.ethereum !== undefined) {
    try {
      const options = {};
      const parsedName = contractName.replace(/\s/g, '');

      const compiledContract = (await solidityCompiler({
        version: 'https://binaries.soliditylang.org/bin/soljson-v0.8.17+commit.8df45f5f.js',
        contractBody: sourceCode,
        options,
      }));
      console.log("🚀 ~ file: contract-deploy.js:42 ~ compile ~ compiledContract", compiledContract)
      return {
        abi: compiledContract?.contracts?.Compiled_Contracts[parsedName].abi,
        bytecode: compiledContract?.contracts?.Compiled_Contracts[parsedName].evm.bytecode.object,
      };
    } catch (error) {
      console.log('🚀 ~ file: erc721compiler.ts:285 ~ compile ~ error', error);
    }
  }
};