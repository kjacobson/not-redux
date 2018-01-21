const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const reducer = require('../reducer');
const applyDispatch = require('../../lib/util/apply_dispatch');

const handleItemDetails = (e, dispatch) => {
    e.preventDefault();
    const itemId = parseInt(e.target.dataset.itemId);
    dispatch(ACTION_TYPES.TOGGLE_LIST_ITEM_DETAILS, itemId);
};
const handleDeleteItem = (e, dispatch) => {
    e.preventDefault();
    const itemId = parseInt(e.target.dataset.itemId);
    dispatch(ACTION_TYPES.REMOVE_LIST_ITEM, itemId);
};

const detailsLink = (item, dispatch) => {
    return bel`<a href="/items/${item.id}/" data-item-id="${item.id}" onclick="${applyDispatch(handleItemDetails, dispatch)}">Details</a>`;
};

const deleteLink = (item, dispatch) => {
    return bel`<a href="/items/${item.id}/delete" data-item-id="${item.id}" onclick="${applyDispatch(handleDeleteItem, dispatch)}">Delete</a>`;
};

const listItem = (item, dispatch) => {
  return bel`<tr>
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>${detailsLink(item, dispatch)}</td>
    <td>${deleteLink(item, dispatch)}</td>
  </tr>`;
};

module.exports = listItem;
