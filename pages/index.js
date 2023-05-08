import React, { useEffect, useState } from 'react';
import { balanceOf, checkBonesOfOwner } from '../utils/approving-bone';
import { checkCurrentCorgisMinted, checkMaxEarlyAccess, mintEarlyAccess, checkIfEarlyAccessIsActive, checkBoneBal } from '../utils/approving-corgis-early-access';
import { checkChain, getCurrentWalletConnected } from '../utils/connection';


const Home = () => { 
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [maxEarly, setMaxEarly] = useState(0);
  const [mintQt, setMintQt] = useState(0);
  const [isAllowedToMint, setIsAllowedToMint] = useState(false);
  const [currentEarly, setCurrentEarly] = useState(0);
  const [isEarlyMintActive, setIsEarlyMintActive] = useState(false);
  const [boneIds, setBoneIds] = useState([]);
  const [boneBalance, setBoneBalances] = useState(0);
  const [currentBoneId, setCurrentBoneId] = useState(null);

  const handleChange = (event) => {
    setMintQt(event.target.value)
  }

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
      checkHasEarlyAccess();
      checkAvailability();
      checkEarlyAccessIsActive();
      checkBonesId();
    }
  }

  const checkEarlyAccessIsActive = async () => {
    const isActive = await checkIfEarlyAccessIsActive();
    setIsEarlyMintActive(isActive);
  }

  const getChainId = async () => {
    const chain = await checkChain();
    setIsCorrectChain(chain);
  }


  const connectMetaMask = async () => {
    getAccounts()
  }

  const checkHasEarlyAccess = async () => {
    try {
      const balance = await balanceOf();
      if(balance < 1) {
        setIsAllowedToMint(false);
      } else {
        setIsAllowedToMint(true);
      }
    } catch (error) {
      
    }
  }

  const mintCorgisEarly = async () => {
    const payload = {
      boneTokenId: currentBoneId,
      amount: (mintQt  * 0.05), // number of corgis * price
      numberOfTokens: mintQt,
    }
    const mint = await mintEarlyAccess(payload);
    console.log("🚀 ~ file: index.js ~ line 85 ~ mintBone ~ mint", mint)
  }

  const checkAvailability = async() => {
    const maxCorgis = await checkMaxEarlyAccess();
    const hasMinetd = await checkCurrentCorgisMinted();
    setMaxEarly(maxCorgis);
    setCurrentEarly(hasMinetd);
  }

  const checkBonesId = async() => {
    const bones = await checkBonesOfOwner();
    console.log("🚀 ~ file: early-mint.js ~ line 110 ~ checkBonesId ~ bones", bones)
    setBoneIds(bones);
    checkBoneB(bones[0]);
    setCurrentBoneId(bones[0]);
  }

  const checkBoneB = async(id) => {
    const boneBal = await checkBoneBal({boneTokenId: id});
    console.log("🚀 ~ file: early-mint.js ~ line 122 ~ checkBoneBal ~ boneBal", boneBal)
    setBoneBalances(5 - boneBal);
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
                  <p>{addresses}</p>
                  :
                  <h2>Wrong Chain. Chain must be Rinkeby</h2>
              )
            )
            :
          <h2>You must install metamask</h2>
        }
      </div>
      <div>
        { isEarlyMintActive ? (
          isAllowedToMint ? 
          <div>
            <h2>Early Access Mint</h2>
            <p>bone IDs: {boneIds}</p>
            <p>bone balance: {boneBalance}</p>
            Quantity <input type="number" value={mintQt}  onChange={handleChange} />
            <button onClick={() => mintCorgisEarly()}>Mint Early Access</button>
            <p>Count: {currentEarly}/{maxEarly}</p>
          </div>
          : 
          <h3>You are not eligible for early access</h3>
        ) : 
          <div>
            <h2>Early Access Mint Not Yet Active </h2>
          </div>
        }
      </div>
    </div>
  )
}

export default Home;