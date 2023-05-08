import axios from "axios";
import { ethers } from "ethers";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

export const getBalance = async (address) => {
  try {
    const params = new URLSearchParams();
    params.append('apikey', process.env.NEXT_ETHERSCANAPI_KEY);
    params.append('module', 'account');
    params.append('action', 'balance');
    params.append('address', address);
    params.append('tag', 'latest');

    // reference: https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address
    const { data } = await axios.get(`https://api.etherscan.io/api`, {
      params,
    });
    return parseFloat(web3.utils.fromWei(data?.result)).toFixed(2);
  } catch (error) {
    console.log("🚀 ~ file: etherscan.js:19 ~ getBalance ~ error:", error)
    return error;
  }
};