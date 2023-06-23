import React, { createContext, useMemo, useState } from 'react';
import {
  ConnectWallet, ThirdwebSDK, useAddress, useSDK, useStorage
} from '@thirdweb-dev/react';
import { OrchidzBuildContractAddr } from 'src/smartContract/networkDetails';
import OrchidzBuildAbi from 'src/smartContract/OrchidzBuildAbi.json';
import { ethers } from 'ethers';

interface ContextProps {
  address: string,
  sdk: any,
  storage: any,
  getOrchidzContract: () => any,
  getNftMetaData: (nftId: number) => any,
  getUserNftBalance: (nftId: number) => any,
  mintNft: (nftId: number, nftPrice: string) => any
}

export const Web3ConnectionContext = createContext<ContextProps>({
  address: '',
  sdk: '',
  storage: '',
  getOrchidzContract: () => { },
  getNftMetaData: (nftId): any => { },
  getUserNftBalance: (nftId): any => { },
  mintNft: (nftId, nftPrice): any => { }
});

const Web3ConnectionWrapper = (props) => {
  const address = useAddress();
  const storage = useStorage();
  const sdk = useSDK();
  const { children } = props;

  async function getOrchidzContract() {
    const OrchidzBuildCreatorContract = await sdk.getContract(
      OrchidzBuildContractAddr,
      OrchidzBuildAbi
    );
    return OrchidzBuildCreatorContract;
  }

  async function getNftMetaData(nftId: number) {
    try {
      const OrchidzBuildCreatorContract = await getOrchidzContract();
      const tx = await OrchidzBuildCreatorContract.call(
        'nftDetailOf', // Name of your function as it is on the smart contract
        [
          nftId
        ]
      );
      const durii = await storage.download(tx.uri);
      const metadataReq = await fetch(durii.url);
      const metadata = await metadataReq.json();
      const _imgurl = await storage.download(metadata.image);
      return {
        ...metadata,
        price: Number(Number(tx.mintPrice) / 10 ** 18),
        image: _imgurl.url
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserNftBalance(nftId: number) {
    try {
      const OrchidzBuildCreatorContract = await getOrchidzContract();
      const tx = await OrchidzBuildCreatorContract.call(
        'balanceOf', // Name of your function as it is on the smart contract
        [
          address,
          nftId
        ]
      );
      return tx
    } catch (error) {
      console.log("balanceOf error", error);
    }
  }

  async function mintNft(nftId: number, nftPrice: string) {
    try {
      const OrchidzBuildCreatorContract = await getOrchidzContract();
      const tx = await OrchidzBuildCreatorContract.call(
        'mint', // Name of your function as it is on the smart contract
        [
          address,
          nftId,
          1
        ],
        {
          value: ethers.utils.parseUnits(String(nftPrice), "ether")
        }
      );
      console.log(tx);
      
      return true;
    } catch (error) {
      console.log("mintNft error", error);

      return false
    }
  }
  return (
    <Web3ConnectionContext.Provider value={{
      address, sdk, storage, getOrchidzContract, getNftMetaData, getUserNftBalance, mintNft
    }}
    >
      {children}
    </Web3ConnectionContext.Provider>
  );
};

export default Web3ConnectionWrapper;
