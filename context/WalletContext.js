import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

import {
  connectWalletByType,
  disconnectWalletbyType,
  getAccount,
  hasConnected,
  getBalance,
  accountChangeListener,
  chainChangeListener,
  getChainId,
  getChainNameById,
  toCheckSumAddress,
} from "../contract/services/client/connection";

export const WalletContext = createContext();

export default function WalletProvider({ children }) {
  const router = useRouter();
  const [wallets] = useState([
    {
      type: "metamask",
      imageName: "metamask",
    },
    {
      type: "wallet-connect",
      imageName: "WalletConnect",
    },
  ]);
  const [walletsModal, setWalletsModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [networkChain, setNetworkChain] = useState({
    chainId: 0,
    chainName: "",
  });
  const [balance, setBalance] = useState(0);

  const checksumAddress = (address) => {
    let checkSumAddress = address;
    if (address != "") {
      try {
        checkSumAddress = toCheckSumAddress(address);
      } catch (e) {
        console.log("Error", e);
      }
    }
    return checkSumAddress;
  };

  const accountChangeHandler = async (newAccount) => {
    let chainId = await getChainId();
    let chainName = getChainNameById(chainId);
    setNetworkChain({
      chainId: chainId,
      chainName: chainName,
    });

    setWalletAddress(checksumAddress(newAccount));
    getBalance().then((balance) => {
      setBalance(balance);
    });
  };

  const setAccountAndChainId = async () => {
    getAccount().then((account) => {
      setWalletAddress(checksumAddress(account));
    });
    getBalance().then((balance) => {
      setBalance(balance);
    });
    getChainId().then(function (chainId) {
      let chainName = getChainNameById(chainId);
      setNetworkChain({
        chainId: chainId,
        chainName: chainName,
      });
    });
  }

  const chainChangeHandler = async (_chainId) => {
    router.reload();
  };

  useEffect(() => {
    hasConnected()
      .then((res) => {
        if (res) {
          setAccountAndChainId();
        }
        accountChangeListener(accountChangeHandler);
        chainChangeListener(chainChangeHandler);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        await connectWalletByType("wallet-connect");
        setAccountAndChainId();
      } else {
        setWalletsModal(true);
      }
    } catch (err) {
      throw err;
    }
  }

  async function disconnectWallet() {
    try {
      await disconnectWalletbyType();
      setWalletAddress("");
      setBalance(0);
      setNetworkChain({
        chainId: 0,
        chainName: "",
      });
    } catch (err) {
      throw err;
    }
  }

  const value = {
    wallets,
    walletAddress,
    setAccountAndChainId,
    setWalletAddress,
    networkChain,
    setNetworkChain,
    balance,
    setBalance,
    connectWallet,
    disconnectWallet,
    walletsModal,
    setWalletsModal,
    connectWalletByType,
  };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
