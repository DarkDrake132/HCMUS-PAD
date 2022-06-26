import { Fragment } from 'react';

import ItemHead from './ItemHead/ItemHead';
import ItemList from './ItemList/ItemList';

import Spinner from '../ui/Spinner/Spinner';

import classes from './PoolListItems.module.css';

function PoolListItems(props) {
  //console.log('poolist props: ', props)
  let PoolList;
  if(props.loading) {
    PoolList = 
      <div className={classes.LoadingMessage}>
        <Spinner classesName='SizeS'/>
        <p className={classes.NotificationText}>Loading...</p>
      </div>
  } 
  else {
    PoolList = <p className={classes.EmptyAnnounce}>This list is empty !!!</p>;
    if (props.data?.length > 0) {
      PoolList =
      <Fragment>
        <ItemHead status={props.status} header={props.header} />
        <ItemList status={props.status} data={props.data} fetch={props.fetch} hasMore={props.hasMore}/>
      </Fragment>
    }
  }
  return (
    <div className={classes.ListItems}>
      <h3 className={classes.Title}>{props.title}</h3>
      {PoolList}
    </div>
  )
}

export default PoolListItems;