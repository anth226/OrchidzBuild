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
  getOrchidzContract: () => any
}

export const Web3ConnectionContext = createContext<ContextProps>({
  address: '',
  sdk: '',
  storage: '',
  getOrchidzContract: () => {}
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

  return (
    <Web3ConnectionContext.Provider value={{
      address, sdk, storage, getOrchidzContract
    }}
    >
      {children}
    </Web3ConnectionContext.Provider>
  );
};

export default Web3ConnectionWrapper;
