import classes from './PoolList.module.css';
import PoolItem from '../PoolItem/PoolItem';

function PoolList(props) {
  return (
    <ul className={classes.List}>
      {props.pools.map((pool,index) => (
        <PoolItem
          key={index}
          {...pool}
        />
      ))}
    </ul>
  );
}

export default PoolList;
