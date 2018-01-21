const bel = require('bel');
const raw = require('bel/raw');
const list = require('./list');
const listItem = require('./list_item');

/*
 * Just a plain old function! Not concerned with
 * the framework.
 */
const getPageFromList = (offset, count, list) => {
    return list.slice(offset, offset + count);
};
const AppComponent = (dispatch, state) => {
    /* The current implementation of the App's render()
     * method expects to be replacing a child node of the body,
     * so this method should return a DOM node whose ID
     * corresponds to whatever was passed into the App on
     * initialization. We could easily rewrite to just be
     * template literals and innerHTML though.
     */
    return bel`<main id='appRoot'>
        ${state.pending ?
            raw('<p>Pending...</p>') :
            list(dispatch, {
                currentPage : getPageFromList(state.offset, state.count, state.items),
                count : state.count,
                offset : state.offset,
                totalItems : state.items.length,
                listItemComponent : listItem
            })
        }
    </main>`;
};
module.exports = AppComponent;
