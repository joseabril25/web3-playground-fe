import Web3 from 'web3';
import config from "./env";
import { MerkleTree } from "merkletreejs";
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import axios from 'axios';


const contractAddress = config.tastyBonesContract;
const ABI = config.tbABI;
const web3 = new Web3(Web3.givenProvider);

/*
  * This function checks whether the user has already minted a bone
  * If they do, then they can no longer mint
  * OGs can only have 1 Bone
*/
const balanceOf = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const balance = await  window.contract.methods.balanceOf(window.ethereum.selectedAddress).call()
      console.log("🚀 ~ file: approving-bone.js ~ line 33 ~ balanceOf ~ balance", balance)
      return balance;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks whether the user has already minted a bone
  * If they do, then they can no longer mint
  * OGs can only have 1 Bone
*/
const getMetadata = async (id) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const metadata = await  window.contract.methods.tokenURI(id).call()
      console.log("🚀 ~ file: approving-bone.js ~ line 33 ~ metadata ~ metadata", metadata)
      const { data, status } = await axios.get(metadata);
      console.log("🚀 ~ file: tastybones.js:42 ~ getMetadata ~ response:", data)

      if (status < 400) {
        return data;
      }
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function mints 1 bone, if the user has not yet claimed theirs
*/
const mintFreesale = async ({numOfTokens}) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      // FOR WL
      const leafNodes = addressesFreeMint.map(addr => solidityKeccak256(["address","uint256"], [addr.address, addr.maxMint]));
      const freeMintMerkleTree = new MerkleTree(leafNodes, (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"), {sortPairs: true});
      const claimingAddress2 = solidityKeccak256(["address","uint256"], [window.ethereum.selectedAddress, 1]);
      const testverify2 = freeMintMerkleTree.verify(freeMintMerkleTree.getHexProof(claimingAddress2), claimingAddress2, freeMintMerkleTree.getHexRoot());
      console.log("🚀 ~ file: tasty-bones.js ~ line 96 ~ mintFreesale ~ testverify2", testverify2)
      
      const mint = await window.contract.methods.mintFreeWL(
        1, // number to Mint
        freeMintMerkleTree.getHexProof(claimingAddress2), // WL proof
        1, // max Mint
        )
        .send(
          {
            from: window.ethereum.selectedAddress, 
            value: 0
          }
        );
      return mint;
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintBone ~ error", error)
    }
  }
}

export { 
  balanceOf,
  mintFreesale,
  getMetadata
}