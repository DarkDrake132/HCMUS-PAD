import { getWeb3 } from "./connection";
import Pool from "../../class/Pool";
import Big from "big.js";

/**
 * get pool contract to call/send method
 * @param {address} address pool's address
 * @returns contract
 */
export async function getPool(address) {
  try {
    const web3 = getWeb3();
    const pool = new Pool();
    await pool.init(web3, address, true);
    return pool;
  } catch (err) {
    throw err;
  }
}

/**
 * swap token
 * @param {address} address pool's address
 * @param {number} value amount of token (token unit)
 */
export async function swap(address, value) {
  const pool = new Pool();
  const web3 = getWeb3();
  await pool.init(web3, address, true);
  const accounts = await web3.eth.getAccounts();

  let res = await fetch("/api/account/checkKYC", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: accounts[0],
    }),
  });
  const iskyc = await res.json();

  if (!iskyc) {
    throw new Error("User haven't KYC yet");
  }

  try {
    const decimals = await pool.decimals;
    const tokenValue = new Big(value).mul(new Big(10 ** decimals)).toFixed();

    await pool.swap(tokenValue);

    await fetch("/api/pools/joinpool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        account: accounts[0],
      }),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get Pool's infomation
 * @param {address} address pool's address
 * @returns purchaseId, totalRaise, maxAllocation, whitelisted, tokenForSale, totalSoldToken, tokenPrice, status, purchases
 */
export async function getPoolInfo(address) {
  try {
    const pool = await getPool(address);
    const info = await pool.getInformation();
    const maximumCost = await pool.getCostFromTokens(
      new Big(await pool.tokensForSale)
        .div(new Big(10 ** info.decimals))
        .toString()
    );
    const isWhitelisted = maximumCost != 0;
    let purchases = isWhitelisted ? await pool.getMyPurchases() : [];
    purchases = purchases.map(async (purchase) => {
      return {
        purchaseId: purchase.id,
        tokenAmount: new Big(purchase.tokensAmount)
          .div(new Big(10 ** info.decimals))
          .toString(),
        fundsAmount: new Big(purchase.fundsAmount)
          .div(new Big(10 ** 18))
          .toString(),
        allocationTime: Number(purchase.timestamp),
        wasFinalize: purchase.wasFinalized,
        wasFailed: purchase.wasFailed,
      };
    });

    return {
      totalRaise: new Big(info.totalCost).div(new Big(10 ** 18)).toString(),
      maxAllocation: new Big(maximumCost).div(new Big(10 ** 18)).toString(),
      whitelisted: isWhitelisted,
      tokenForSale: new Big(info.tokensForSale)
        .div(new Big(10 ** info.decimals))
        .toString(),
      totalSoldToken: new Big(info.tokensAllocated)
        .div(new Big(10 ** info.decimals))
        .toString(),
      tokenPrice: new Big(info.tradeValue).div(new Big(10 ** 18)).toString(),
      status:
        info.startDate > Date.now() / 1000
          ? "upcoming"
          : info.endDate > Date.now() / 1000
          ? "active"
          : "ended",
      purchases,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Get Pool's infomation
 * @param {address} address pool's address
 * @returns purchaseId, totalRaise, maxAllocation, whitelisted, tokenForSale, totalSoldToken, tokenPrice, status, purchases
 */
export async function isPoolFunded(address) {
  try {
    const pool = await getPool(address);
    return await pool.isFunded;
  } catch (err) {
    throw err;
  }
}

/**
 *
 * @param {address} OwnerAddress address of owner
 * @returns list of (purchaseId, totalRaise, maxAllocation, whitelisted, tokenForSale, totalSoldToken, tokenPrice, status, purchases)
 */
export async function getCreatedPools(OwnerAddress) {
  const response = await fetch("/api/pools/mycreated", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: OwnerAddress,
    }),
  });
  let projects = await response.json();

  if (projects.error) {
    throw projects.error;
  }

  const web3 = await getWeb3();
  projects = projects.filter((p) => p.ChainId == web3.currentProvider.chainId);

  let pools = projects.map(async (p) => {
    const pool = await getPoolInfo(p.PoolAddress);
    return {
      ...pool,
      id: p.Name.toLowerCase().split(" ").join("-"),
      poolName: p.Name,
      logo: p.LogoUrl,
      beginTime: p.BeginTime,
      endTime: p.EndTime,
      poolAddress: p.PoolAddress,
    };
  });
  pools = await Promise.all(pools);
  return pools;
}

/**
 *
 * @param {address} UserAddress address of buyer
 * @returns list of (purchaseId, totalRaise, maxAllocation, whitelisted, tokenForSale, totalSoldToken, tokenPrice, status, purchases)
 */
export async function getJoinedPools(UserAddress) {
  const response = await fetch("/api/pools/myjoined", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: UserAddress,
    }),
  });
  let projects = await response.json();

  if (projects.error) {
    throw projects.error;
  }

  const web3 = getWeb3();
  projects = projects.filter((p) => p.ChainId == web3.currentProvider.chainId);

  let pools = projects.map(async (p) => {
    const pool = await getPoolInfo(p.PoolAddress);
    return {
      ...pool,
      id: p.Name.toLowerCase().split(" ").join("-"),
      poolName: p.Name,
      logo: p.LogoUrl,
      beginTime: p.BeginTime,
      endTime: p.EndTime,
      poolAddress: p.PoolAddress,
    };
  });
  pools = await Promise.all(pools);

  return pools;
}

/**
 * Switch Pause status the Pool
 */
export const switchPauseStatus = async (address) => {
  try {
    const Pool = await getPool(address);
    if (await Pool.isPaused) {
      await Pool.unpause();
    } else {
      await Pool.pause();
    }
  } catch (err) {
    throw err;
  }
};


/**
 * Switch Pause status the Pool
 */
export const isPoolPause = async (address) => {
  try {
    const Pool = await getPool(address);
    return await Pool.isPaused;
  } catch (err) {
    throw err;
  }
};
