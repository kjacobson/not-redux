const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const reducer = require('../reducer');
const applyDispatch = require('../../lib/util/apply_dispatch');

/*
 * DOM event handlers expect to be passed 
 * an event object and a dispatch method.
 * Since the vDOM implementation handles
 * event binding, we create a partially-applied
 * version of our event handlers that already
 * knows about dispatch.
 */
const handleItemDetails = (dispatch, e) => {
    e.preventDefault();
    const itemId = parseInt(e.target.dataset.itemId);
    dispatch(ACTION_TYPES.SHOW_LIST_ITEM_DETAILS, itemId);
};
const handleDeleteItem = (dispatch, e) => {
    e.preventDefault();
    const itemId = parseInt(e.target.dataset.itemId);
    requestToDeleteListItem(dispatch, itemId);
    dispatch(ACTION_TYPES.REMOVE_LIST_ITEM, itemId);
};

const detailsLink = (dispatch, item) => {
    return bel`<a href="/items/${item.id}/" data-item-id="${item.id}" onclick="${applyDispatch(handleItemDetails, dispatch)}">Details</a>`;
};

const deleteLink = (dispatch, item) => {
    return bel`<a href="/items/${item.id}/delete" data-item-id="${item.id}" onclick="${applyDispatch(handleDeleteItem, dispatch)}">Delete</a>`;
};

const listItem = (dispatch, item) => {
  return bel`<tr>
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>${detailsLink(dispatch, item)}</td>
    <td>${deleteLink(dispatch, item)}</td>
  </tr>`;
};

module.exports = listItem;
