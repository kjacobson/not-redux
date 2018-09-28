const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const applyDispatch = require('../../lib/util/apply_dispatch');

const handleHideDetails = (dispatch, e) => {
    e.preventDefault();
    dispatch(ACTION_TYPES.HIDE_LIST_ITEM_DETAILS);
};

const itemDetails = (dispatch, item) => {
    return bel`<aside class='item-details-container'>
        <dl class='item-details'>
            <dt>Name:</dt>
            <dd>${item.name}</dd>

            <dt>Bio:</dt>
            <dd>${item.bio}</dd>
        </dl>
        <a href="/items" onclick="${applyDispatch(handleHideDetails, dispatch)}">Hide details</a>
    </aside>`;
};

module.exports = itemDetails;
