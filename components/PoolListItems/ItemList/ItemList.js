import InfiniteScroll from 'react-infinite-scroll-component';
import ItemListData from '../ItemListData/ItemListData';
import Spinner from '../../ui/Spinner/Spinner'

import classes from './ItemList.module.css'

const ItemList = (props) => {
  let endMessage = null
  let loadingMessage = null
    
  if (props.status === "ended") {
    endMessage = 
      <p className={classes.NotificationText}>
        You have seen all ended pools !!!
      </p>

    loadingMessage = 
      <div className={classes.LoadingMessage}>
        <Spinner classesName='SizeS'/>
        <p className={classes.NotificationText}>Loading...</p>
      </div>
      
    
    return (
      <ul className={classes.List}>
        <InfiniteScroll 
            style={{overflow: 'unset'}}
            dataLength={props.data.length}
            next={props.fetch}
            hasMore={props.hasMore}
            loader={loadingMessage}
            endMessage={endMessage}
        >
          {props.data?.map((item, index) => {
            return (
              <ItemListData key={index} data={item}/>
            ) 
          })}
        </InfiniteScroll>
      </ul>
    )
  } else {
    return (
      <ul className={classes.List}>
        {props.data?.map((item, index) => {
          return (
            <ItemListData key={index} data={item}/>
          )
        })}
      </ul>
    )
  }
}

export default ItemList;