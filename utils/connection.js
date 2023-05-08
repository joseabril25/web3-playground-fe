import constants from "./constants";
import config from "./env";
/*
  * This function checks if metamask is installed, is metamask connected
*/
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        return {address: addressArray[0], status: 'Connected'}
      } else {
        return {address: null, status: 'Not Connected'};
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: 'No MetaMask Installed'
    };
  }
};

/*
  * This function checks if user is connected to the correct chain
*/
export const checkChain = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if(chainId === config.chainId) { // Rinkeby testnet, Ethereum for mainnet
    return true;
  } else {
    return false;
  }
}