const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const applyDispatch = require('../../lib/util/apply_dispatch');

const handleChangePage = (e, dispatch) => {
    e.preventDefault();
    const url = e.target.getAttribute('href');
    const [match, count, offset] = url.match(/\?.*count=(\d+)&offset=(\d+)/i);
    dispatch(ACTION_TYPES.REQUEST_NEW_PAGE, { count : parseInt(count), offset : parseInt(offset) });
};
const paginationLink = (props, dispatch) => {
    const { count, offset, text } = props;
    return bel`<td>
        <a href="/items/?count=${count}&offset=${offset}" onclick="${applyDispatch(handleChangePage, dispatch)}">
            ${text}
        </a>
    </td>`;
};

const list = (props, dispatch) => {
  const {currentPage, count, offset, totalItems, listItemComponent} = props;  
  return bel`<table>
    <tbody>
        ${currentPage.map(applyDispatch(listItemComponent, dispatch))}
    </tbody>
    <tfoot>
        <tr>
            ${(offset - count >= 0 ? paginationLink({count, offset : offset - count, text : 'Prev Page'}, dispatch) : '')}
            ${(offset + count < totalItems ? paginationLink({count, offset : offset + count, text : 'Next Page'}, dispatch) : '')}
        </tr>
    </tfoot>
  </table>`;
};

module.exports = list;
