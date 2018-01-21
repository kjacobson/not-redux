const ACTION_TYPES = require('./action_types');

const requestToDeleteListItem = (itemId, dispatch) => {
    setTimeout(() => {
        dispatch(ACTION_TYPES.LIST_ITEM_REMOVED, itemId);
    }, 2000);
};
const removeListItemFromList = (items, itemId) => {
    return items.filter((item) => {
        return item.id !== itemId;
    });
};
const requestToChangePage = (pageData, dispatch) => {
    setTimeout(() => {
        dispatch(ACTION_TYPES.CHANGE_PAGE, pageData);
    }, 500);
};

module.exports = { requestToDeleteListItem, removeListItemFromList, requestToChangePage };
