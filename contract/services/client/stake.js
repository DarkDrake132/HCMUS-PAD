import { getWeb3 } from "./connection";
import DreStake from "../../class/DreStake";
import Big from "big.js";

const DECIMAL = 18;

/**
 * Get the stake contract
 * @param {address} address stake contract's address
 * @returns stake
 */
export async function getStakeContract(address) {
  try {
    const web3 = getWeb3();
    const stakeContract = new DreStake();
    await stakeContract.init(web3, address);
    return stakeContract;
  } catch (err) {
    throw err;
  }
}

/**
 * Get all address that staked
 * @param {address} address stake contract's address
 * @returns stake
 */
export async function getStakers(address) {
  try {
    const stakeContract = await getStakeContract(address);
    return await stakeContract.allStakers;
  } catch (err) {
    throw err;
  }
}

/**
 * Get all info from address that staked
 * @param {address} address stake contract's address
 * @returns stake
 */
export async function getStakerInfo(address) {
  try {
    const stakeContract = await getStakeContract(address);
    const { amount, point, maxPoint } = await stakeContract.myStakeInfo();
    return {
      amount: new Big(amount).div(new Big(10 ** DECIMAL)).toFixed(0),
      point: new Big(point).toFixed(0),
      maxPoint: new Big(maxPoint).toFixed(0),
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Get all info from address that staked
 * @param {address} address stake contract's address
 * @returns stake
 */
 export async function getAddressStakingInfo(stakeAddress,walletAddress) {
  try {
    const stakeContract = await getStakeContract(stakeAddress);
    const { amount, point, maxPoint } = await stakeContract.stakeInfo(walletAddress);
    return {
      amount: new Big(amount).div(new Big(10 ** DECIMAL)).toFixed(0),
      point: new Big(point).toFixed(0),
      maxPoint: new Big(maxPoint).toFixed(0),
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Get max amount can withdraw of address
 * @param {address} address stake contract's address
 * @returns max amount to withdraw
 */
export async function getWithdrawMaxAmount(stakeAddress, address) {
  try {
    const stakeContract = await getStakeContract(stakeAddress);
    const max = await stakeContract.maxAmount2Withdraw(address);
    return new Big(max).div(new Big(10 ** DECIMAL)).toFixed(0);
  } catch (err) {
    throw err;
  }
}

/**
 * Stake to contract
 * @param {address} address stake contract's address'
 */

export async function stake(address, amount) {
  try {
    const stakeContract = await getStakeContract(address);
    const res = await stakeContract.stake(
      new Big(amount).mul(new Big(10 ** DECIMAL)).toFixed()
    );
    return res.receipt.status;
  } catch (err) {
    throw err;
  }
}

/**
 * Stake to contract
 * @param {address} address stake contract's address'
 */

export async function withdraw(address, amount) {
  try {
    const stakeContract = await getStakeContract(address);
    const res = await stakeContract.withdraw(
      new Big(amount).mul(new Big(10 ** DECIMAL)).toFixed()
    );
    return res.receipt.status;
  } catch (err) {
    throw err;
  }
}

/**
 * withdraw all token staked from contract
 * @param {address} address stake contract's address'
 */

export async function withdrawAll(address) {
  try {
    const stakeContract = await getStakeContract(address);
    const res = await stakeContract.withdrawAll();
    return res.receipt.status;
  } catch (err) {
    throw err;
  }
}
