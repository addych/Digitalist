import React from 'react';
import Item from "./Item";

const ItemList = ({ data, currentPage, getAllItems }) => {
  // Sort items by addedDate
  const sortedItems = data?.content?.length > 0 ? [...data.content].sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate)) : [];

  return (
    <main className='main'>
      {data?.content?.length === 0 && <div>No Items, Please add a new item</div>}
      <ul className='item__list'>
        {sortedItems.length > 0 && sortedItems.map(item => <Item item={item} key={item.id} />)}
      </ul>

      {data?.content?.length > 0 && data?.totalPages > 1 &&
        <div className='pagination'>
          <a onClick={() => getAllItems(currentPage - 1)} className={0 === currentPage ? 'disabled' : ''}>&lt;</a>
          {data && [...Array(data.totalPages).keys()].map((page, index) =>
            <a onClick={() => getAllItems(page)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>)}
          <a onClick={() => getAllItems(currentPage + 1)} className={data.totalPages === currentPage + 1 ? 'disabled' : ''}>&gt;</a>
        </div>
      }
    </main>
  );
}

export default ItemList;