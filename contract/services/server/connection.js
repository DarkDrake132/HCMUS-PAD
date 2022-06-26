const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

// **NOTE**:    Điền mã mnemonic (12 từ) và link api infura vào bên dưới trước khi chạy
const MNEMONIC = process.env.MNEMONIC

const getWeb3 = (chainId) => {
    const URL_API = process.env[`CHAIN_${chainId}_API`]

    let provider
    // Khởi tạo provider
    provider = new HDWalletProvider({
        mnemonic: {
            phrase: MNEMONIC,
        },
        providerOrUrl: URL_API,
        pollingInterval: 60000,
    })

    const web3 = new Web3(provider)
    return web3
}

module.exports = getWeb3
