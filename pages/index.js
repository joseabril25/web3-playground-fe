import React, { useEffect, useState } from 'react';
import { checkChain, getCurrentWalletConnected } from '../utils/connection';
import { getMetadata } from '../utils/tastybones';
import { getBalance } from '../utils/etherscan';

const Home = () => { 
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);

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
      const bal = await getBalance(connection.address);
      setAccountBalance(bal);
    }
  }

  const getChainId = async () => {
    const chain = await checkChain();
    setIsCorrectChain(chain);
  }


  const connectMetaMask = async () => {
    getAccounts()
  }

  const getData = async () => { 
    if (tokenId === null) return;
    console.log("🚀 ~ file: index.js:63 ~ getData ~ tokenId:", tokenId)
    const data = await getMetadata(tokenId);
    setMetadata(data);
  }
  return (
    <div>
      <div>
        {hasMetamask ? 
          (
            !connected ? 
              <button onClick={() => connectMetaMask()}>Connect Metamask</button>
            :
              (
                isCorrectChain ?
                <div>
                  <p>Connected Address: {addresses}</p>
                  <p>Balance: {accountBalance} ETH</p>
                  <div> 
                    <input type="text" onChange={(e) => setTokenId(e.target.value)} />
                    <button onClick={() => getData()}>Get Metadata</button>
                  </div>

                  <div>
                    {metadata && (
                      <div>
                        <img
                          src={metadata?.image}
                          width={500}
                          height={500}
                          alt="Picture of the Product"
                        />
                        <h3>Name: </h3>
                        <p>{metadata?.name}</p>
                        <h3>Description:</h3>
                        <p>{metadata?.description}</p>
                        <h3>Product Description</h3>
                        {
                          metadata?.attributes.map((attribute, index) => (
                            <div key={index}>
                              <p>{attribute.trait_type}: {attribute.value}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
                  :
                  <h2>Wrong Chain. Chain must be Rinkeby</h2>
              )
            )
            :
          <h2>You must install metamask</h2>
        }
      </div>
      <div>
       
      </div>
    </div>
  )
}

export default Home;