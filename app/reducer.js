const ACTION_TYPES = require('./action_types');
const { requestToDeleteListItem, removeListItemFromList, requestToChangePage } = require('./actions');

/*
 * Reducer gets the following:
 * An entire app state object.
 * The AppState store's getter enforces that
 * this is a clone of the current app state.
 *
 * An action name. 
 * I use ACTION_TYPES above as a convention,
 * so we have some typo-protection.
 *
 * An action data object.
 * This could be anything, but is usually
 * pulled from a DOM node via an event
 * object.
 *
 * A reference to our App's dispatch method.
 */
const reducer = (dispatch, state, actionName, actionData) => {
    let listItemId;
    switch (actionName) {
        case ACTION_TYPES.REQUEST_NEW_PAGE:
            state.pending = true;
            requestToChangePage(dispatch, actionData);
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
            requestToDeleteListItem(dispatch, listItemId);
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

    // Reducer returns new state object
    return state;
};

module.exports = reducer;
