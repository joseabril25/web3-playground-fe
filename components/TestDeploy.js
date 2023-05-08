import React, { useEffect, useState } from 'react';
import { checkChain, getCurrentWalletConnected } from '../utils/connection';
import { generateUsingSource } from '../utils/contract-deploy';
//useSWR allows the use of SWR inside function components
import useSWR from 'swr';

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

const TestDeploy = () => { 
  const { data, error } = useSWR('/api/staticdata', fetcher);
  console.log("🚀 ~ file: deploy.js:13 ~ Deploy ~ data", data)
  console.log("🚀 ~ file: deploy.js:12 ~ Deploy ~ error", error)
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);

  const isMetaMaskInstalled = () => {
    return Boolean(window.ethereum)
  }

  useEffect(() => {
    if(isMetaMaskInstalled()){
      getAccounts();
      setHasMetamask(true);
    } else {
      setHasMetamask(false);
    }
  }, [hasMetamask]);

  useEffect(() => {
    if(isMetaMaskInstalled()) {
      getChainId();
    }
  })

  useEffect(() => {
    if(isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', () => {
        getChainId();
      })
    }
  })

  const getAccounts = async() => {
    const connection = await getCurrentWalletConnected();
    if(connection.status === 'Connected') {
      setAddresses(connection.address);
      setConnected(true);
      // check if user has early access rights
      // checkAvailability();
    }
  }

  const getChainId = async () => {
    const chain = await checkChain();
    setIsCorrectChain(chain);
  }


  const connectMetaMask = async () => {
    getAccounts();
  }

  const compileContract = async () => {
    await generateUsingSource(data.solFile);
  }

  return (
    <div>
        {hasMetamask ? 
          (
            !connected ? 
              <button onClick={() => connectMetaMask()}>Connect Metamask</button>
              :
              (
                isCorrectChain ?
                <>
                  <p>Connected Address: {addresses}</p>
                  <button onClick={() => compileContract()}>Deploy Contract</button>
                </>

                  :
                  <h2>Wrong Chain. Chain must be Rinkeby</h2>
              )
            )
            :
          <h2>You must install metamask</h2>
        }
      </div>
  )
}
  
export default TestDeploy;