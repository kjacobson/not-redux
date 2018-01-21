const ACTION_TYPES = require('./action_types');
const { requestToDeleteListItem, removeListItemFromList, requestToChangePage } = require('./actions');

const reducer = (state, actionName, actionData, dispatch) => {
  let listItemId;
  switch (actionName) {
    case ACTION_TYPES.REQUEST_NEW_PAGE:
      state.pending = true;
      requestToChangePage(actionData, dispatch);
      break;
    case ACTION_TYPES.CHANGE_PAGE:
      state.pending = false;
      state.count = actionData.count;
      state.offset = actionData.offset;
      break;
    case ACTION_TYPES.TOGGLE_LIST_ITEM_DETAILS:
      listItemId = actionData;
      // state = toggleDetailVisibility(state, listItemId);
      break;
    case ACTION_TYPES.REMOVE_LIST_ITEM:
      listItemId = actionData;
      state.pending = true;
      requestToDeleteListItem(listItemId, dispatch);
      break;
    case ACTION_TYPES.LIST_ITEM_REMOVED:
      listItemId = actionData;
      state.pending = false;
      state.items = removeListItemFromList(state.items, listItemId);
      if (state.offset >= state.items.length) {
          state.offset -= state.count;
      }
      break;
  };

  return state;
};

module.exports = reducer;
