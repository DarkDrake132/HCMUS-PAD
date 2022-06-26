const Big = require("big.js");

const {
  UPCOMING,
  ACTIVE,
  ENDED,
} = require("../../../server/data-type/projectStatus");
const {
  getProjects,
  countParticipants,
} = require("../../../server/db/controllers/project");
const Pool = require("../../class/Pool");
const getWeb3 = require("./connection");

async function getDataProject(project, type, userAddress) {
  let pool;
  try {
    const web3 = getWeb3(project.ChainId);
    pool = new Pool();
    await pool.init(web3, project.PoolAddress, false);

    const info = await pool.getInformation();

    const result = {
      Name: project.Name,
      LogoUrl: project.LogoUrl,
      StakeAddress: project.StakeAddress,
      TotalRaise: new Big(info.totalCost).div(new Big(10 ** 18)).toString(),
      TokenAmount: new Big(info.tokensForSale)
        .div(new Big(10 ** info.decimals))
        .toString()
        .toString(),
      MoneyRaise: project.MoneyRaise,
      ChainId: project.ChainId,
    };

    //MaxAllocation is only available in public pool
    result["MaxAllocation"] = userAddress
      ? new Big(await pool.individualMaximumAmount(userAddress))
          .div(new Big(10 ** info.decimals))
          .toString()
      : 0;
    if (type == UPCOMING) {
      result["BeginTime"] = project.BeginTime;
      result["Website"] = project.Website;
    } else {
      const participantAmount = await countParticipants(project.PoolAddress);

      result["EndTime"] = project.EndTime;
      result["SoldAmount"] = new Big(info.tokensAllocated)
        .div(new Big(10 ** info.decimals))
        .toString();
      result["ParticipantAmount"] = participantAmount;
    }
    result["Id"] = project.Name.toLowerCase().split(" ").join("-");
    return result;
  } catch (e) {
    return { error: e.toString().replace("Error: ", "") };
  }
}

async function getPools(
  type,
  amount = undefined,
  step = undefined,
  userAddress = undefined
) {
  if ([UPCOMING, ACTIVE, ENDED].includes(type)) {
    //get projects data from database
    let projects = await getProjects(type, amount, step);

    //getProjects throw error
    if (projects.error) {
      return {
        success: false,
        errors: [projects.error],
      };
    }

    //get pools data from contract
    projects = projects.map((p) => getDataProject(p, type, userAddress));
    const results = await Promise.all(projects);

    // //find errors
    let errors = [];
    results.forEach((p) => {
      if (p.error) {
        errors.push(p.error);
      }
    });

    if (errors.length == 0) {
      return {
        success: true,
        results,
      };
    } else {
      return {
        success: false,
        results: results.filter((p) => !p.error),
        errors,
      };
    }
  }

  return {
    errors: [`Not exist project with status ${type}`],
  };
}

async function getPool(address, chainId) {
  try {
    const web3 = getWeb3(chainId);
    const pool = new Pool();
    await pool.init(web3, address, false);

    return pool
  } catch (error) {
    console.log(error);
    throw error
  }
}
module.exports = {
  getPools,
  getPool,
};
