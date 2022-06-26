import { getWeb3 } from './connection'
import Erc20 from "../../class/Erc20"
import Web3 from 'web3'
import Big from "big.js";
/**
 * Get token's infomation
 * @param {address} tokenAddress token's address
 * @returns {name, symbol, decimals, totalSupply}
 */
export async function getErc20(address) {
    try {
        const web3 = getWeb3()
        const erc20 = new Erc20()
        await erc20.init(web3, address)
        return erc20
    } catch (err) {
        throw err
    }
}

export async function getTokenInfo(tokenAddress) {
    try {
        const web3 = getWeb3()
        const erc20 = new Erc20()
        await erc20.init(web3, tokenAddress)
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            erc20.name,
            erc20.symbol,
            erc20.decimals,
            erc20.totalSupply
        ]);

        return {
            name,
            symbol,
            decimals,
            totalSupply,
        }
    }
    catch (e) {
        return new Error(e.toString().replace("Error: ", ""));
    }
}

export async function getDREBalance(address) {
    // main 
    const web3 = new Web3('https://bsc-dataseed.binance.org/')
    const erc20 = new Erc20()
    await erc20.init(web3, '0xD724E90E7E41Cb88d3445Bcf0F1E5CF4b357DEA9')
    return new Big(await erc20.balanceOf(address)).div(new Big(10 ** 18)).toFixed(0)
}