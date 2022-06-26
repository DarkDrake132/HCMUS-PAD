import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";

import { roundUp } from "../../../utility/NumberUtility";

import classes from "../PoolAllocation/PoolAllocation.module.css";
import Big from "big.js";

function PoolAllocation(props) {
  const allocations = props.allocations;

  const getClaimButton = (wasFinalized, wasFailed, status, claimHandler, index) => {
    if (wasFailed) {
      return <Button style="Rounded NAbtn" disabled>Failed</Button>;
    } else if (wasFinalized) {
      return <Button style="Rounded NAbtn" disabled>Claimed</Button>;
    } else {
      if (status !== props.ENDED) {
        return <Button style="Rounded NAbtn" disabled>Not Available</Button>;
      } else {
        return (
          <Button
            style="Rounded ClaimBtn"
            clicked={() => {
              claimHandler(index);
            }}
          >
            Claim
          </Button>
        );
      }
    }
  };
  // Check if allocations is undefined or null array
  if (!allocations || allocations.length == 0) {
    return null;
  }
  // const firstAllocation = allocations[0];
  return (
    <Card>
      <div className={classes.AllocationCard}>
        <div className={classes.Title}>
          <h3>Your allocations </h3>
        </div>
        <div className={classes.TableCard}>
          <div className={classes.TableHead}>
            <p>Contribution</p>
            <p>Total Tokens</p>
            <p>Allocation Date</p>
            <p>Action</p>
          </div>
          {/* loop in list allocations */}
          {allocations.map((allocation, index) => {
            return (
              // display every allocation in a row
              <div className={classes.TableRow} key={index}>
                <p>{`${(new Big(allocation.fundsAmount.toString())).div(new Big(10**18)).toFixed()} ${props.networkChain.chainName}`}</p>
                <p>{`${(new Big(allocation.tokensAmount.toString())).div(new Big(10**props.decimals)).toFixed()} ${props.symbol}`}</p>
                <p>{new Date(allocation.timestamp.toNumber()*1000).toUTCString()}</p>
                {getClaimButton(
                  allocation.wasFinalized,
                  allocation.wasFailed,
                  props.status,
                  props.claimHandler,
                  allocation.id
                )}
              </div>
            );
          })}
          <div className={classes.ClaimNoti}>
            <p>* You can claim your token when the pool has ended</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PoolAllocation;
