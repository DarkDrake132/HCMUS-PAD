import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

let walletType = "";

//  Create WalletConnect Provider
const getProvider = () => {
  return new WalletConnectProvider({
    rpc: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Mainnet ETH
      4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Rinkeby
      56: "https://bsc-dataseed.binance.org/", // BSC mainnet
      97: "https://data-seed-prebsc-1-s1.binance.org:8545", // BSC testnet
      43114: "https://api.avax.network/ext/bc/C/rpc", // AVAX mainnet
      43113: "https://api.avax-test.network/ext/bc/C/rpc", // FUJI testnet
      43112: "http://localhost:9650/ext/bc/C/rpc", // Local testnet (AVASH)
      137: "https://polygon-rpc.com/", // Polygon mainnet
      80001: "https://rpc-mumbai.matic.today/", // Mumbai testnet
      42220: "https://forno.celo.org/", // Celo mainnet
      44787: "https://alfajores-forno.celo-testnet.org", // Alfajores testnet
      62320: "https://baklava-forno.celo-testnet.org", // Baklava testnet
      // ...
    },
  });
};

let provider = getProvider();

export async function connectWalletByType(wallet) {
  if (wallet === "wallet-connect") {
    walletType = "wallet-connect";
    // Connect to WalletConnect Provider
    try {
      await provider.enable();
    } catch (err) {
      if (err.message == "User closed modal") provider = getProvider();
      console.log("Wallet Connect Err: ", err);
      throw err;
    }
  } else {
    walletType = "metamask";
  }
  return await getAccount();
}

export async function disconnectWalletbyType() {
  if (walletType === "wallet-connect") {
    await provider.disconnect();
    localStorage.removeItem("walletconnect");
  } else {
    // disconect metamask
  }
}

export function getWeb3() {
  let web3;
  if (walletType === "wallet-connect") {
    web3 = new Web3(provider);
  } else {
    if (typeof window.ethereum === "undefined") {
      throw { message: "Please Install Metamask" };
    }
    web3 = new Web3(window.ethereum);
  }

  return web3;
}

export function toCheckSumAddress(address) {
  try {
    const web3 = getWeb3();
    return web3.utils.toChecksumAddress(address);
  } catch (err) {
    throw err;
  }
}

export async function getAccount() {
  try {
    const web3 = getWeb3();
    if (window.ethereum && walletType === "metamask") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } catch (err) {
    throw err;
  }
}

export const getChainNameById = (networkID) => {
  const ID = networkID?.toString();
  switch (ID) {
    //the default case ethereum case
    /**
     * 1: Main network
     * 3: Ropsten
     * 4: Rinkby
     * 5: Goerli
     * 42: Kovan
     */
    case "1":
    case "3":
    case "4":
    case "5":
    case "42":
      return "ETH";
    case "56":
    case "97":
      return "BNB";
    case "43114":
    case "43113":
      return "AVAX";
    case "137":
    case "80001":
      return "MATIC";
    case "42220":
    case "44787":
    case "62320":
      return "CELO";
    default:
      return "ETH";
  }
};

export async function accountChangeListener(accountChangeHandler) {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", function (accounts) {
      accountChangeHandler(accounts[0]);
    });
  } else if (walletType === "wallet-connect") {
    provider.on("accountsChanged", function (accounts) {
      accountChangeHandler(accounts[0]);
    });
  }
}

export async function chainChangeListener(chainChangeHandler) {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("chainChanged", function (_chainId) {
      chainChangeHandler(_chainId);
    });
  } else if (walletType === "wallet-connect") {
    provider.on("chainChanged", function (_chainId) {
      chainChangeHandler(_chainId);
    });
  }
}

export async function hasConnected() {
  try {
    if (localStorage.getItem("walletconnect")) {
      let timeWalletConnectLastConnected = localStorage.getItem(
        "timeWalletConnectLastConnected"
      )
        ? +localStorage.getItem("timeWalletConnectLastConnected")
        : new Date();
      if (Date.now() - timeWalletConnectLastConnected > 1000 * 60 * 60 * 2) {
        // 2 hours
        await provider.disconnect();
        localStorage.removeItem("walletconnect");
        localStorage.removeItem("timeWalletConnectLastConnected");
      } else {
        localStorage.removeItem("timeWalletConnectLastConnected");
        localStorage.setItem("timeWalletConnectLastConnected", Date.now());
        await provider.enable();
        walletType = "wallet-connect";
      }
    } else {
      walletType = "metamask";
    }
    const web3 = getWeb3();
    const accounts = await web3.eth.getAccounts();
    return accounts[0] != undefined;
  } catch (err) {
    throw err;
  }
}

export async function onlyMainNet() {
  try {
    const web3 = getWeb3();
    const chainId = await web3.eth.getChainId();
    return chainId === 1;
  } catch (err) {
    throw err;
  }
}

export async function getBalance() {
  try {
    const web3 = getWeb3();
    const account = await getAccount();
    const balance = await web3.eth.getBalance(account);
    return Number(web3.utils.fromWei(balance, "ether"));
  } catch (err) {
    throw err;
  }
}

export async function getChainId() {
  try {
    const web3 = await getWeb3();
    const chainId = await web3.eth.getChainId();
    return chainId;
  } catch (err) {
    throw err;
  }
}

export async function getChainName() {
  try {
    const web3 = getWeb3();
    const chainId = await web3.eth.getChainId();
    const response = await fetch("https://chainid.network/chains.json");
    const chainListInfo = await response.json();
    console.log(chainListInfo);
    const currentChain = chainListInfo.find((e) => e.chainId == chainId);
    return currentChain.name;
  } catch (err) {
    throw err;
  }
}

/**
 * Use getGasPrice() * 300000 to get estimated gas fee
 * @returns gas's price (wei/gas)
 */
export async function getGasPrice() {
  try {
    const web3 = getWeb3();

    const response = await fetch(
      "https://ethgasstation.info/json/ethgasAPI.json"
    );
    const gasCalcInfo = await response.json();
    const averagePrice = web3.utils.toWei(
      (gasCalcInfo.average / 10).toString(),
      "Gwei"
    );

    return averagePrice;
  } catch (err) {
    throw err;
  }
}
