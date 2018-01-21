const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const applyDispatch = require('../../lib/util/apply_dispatch');

/*
 * DOM event handlers expect to be passed 
 * an event object and a dispatch method.
 * Since the vDOM implementation handles
 * event binding, we create a partially-applied
 * version of our event handlers that already
 * knows about dispatch.
 */
const handleChangePage = (dispatch, e) => {
    e.preventDefault();
    const url = e.target.getAttribute('href');
    const [match, count, offset] = url.match(/\?.*count=(\d+)&offset=(\d+)/i);
    dispatch(ACTION_TYPES.REQUEST_NEW_PAGE, { count : parseInt(count), offset : parseInt(offset) });
};
/*
 * It's just a function. It doesn't have 
 * to be passed a single argument called props.
 * I just do this in cases where it cares about
 * several.
 */
const paginationLink = (dispatch, props) => {
    const { count, offset, text } = props;
    return bel`<td>
        <a href="/items/?count=${count}&offset=${offset}" onclick="${applyDispatch(handleChangePage, dispatch)}">
            ${text}
        </a>
    </td>`;
};

const list = (dispatch, props) => {
  const {currentPage, count, offset, totalItems, listItemComponent} = props;  
  return bel`<table>
    <tbody>
        ${currentPage.map(applyDispatch(listItemComponent, dispatch))}
    </tbody>
    <tfoot>
        <tr>
            ${(offset - count >= 0 ? paginationLink(dispatch, {count, offset : offset - count, text : 'Prev Page'}) : '')}
            ${(offset + count < totalItems ? paginationLink(dispatch, {count, offset : offset + count, text : 'Next Page'}) : '')}
        </tr>
    </tfoot>
  </table>`;
};

module.exports = list;
