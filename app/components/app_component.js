const bel = require('bel');
const raw = require('bel/raw');
const list = require('./list');
const listItem = require('./list_item');

const getPageFromList = (offset, count, list) => {
    return list.slice(offset, offset + count);
};
const AppComponent = (state, dispatch) => {
    return bel`<main id='appRoot'>
        ${state.pending ?
            raw('<p>Pending...</p>') :
            list({
                currentPage : getPageFromList(state.offset, state.count, state.items),
                count : state.count,
                offset : state.offset,
                totalItems : state.items.length,
                listItemComponent : listItem
            }, dispatch)
        }
    </main>`;
};
module.exports = AppComponent;
