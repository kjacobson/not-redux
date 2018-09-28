(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ACTION_TYPES = {
    SHOW_LIST_ITEM_DETAILS : 'showListItemDetails',
    HIDE_LIST_ITEM_DETAILS : 'hideListItemDetails',
    REMOVE_LIST_ITEM : 'removeListItem',
    LIST_ITEM_REMOVED : 'listItemRemoved',
    CHANGE_PAGE : 'changePage',
    REQUEST_NEW_PAGE : 'requestNewPage'
};

module.exports = ACTION_TYPES;

},{}],2:[function(require,module,exports){
const ACTION_TYPES = require('./action_types');

// These could make async requests, obviously.
const requestToDeleteListItem = (dispatch, itemId) => {
    setTimeout(() => {
        dispatch(ACTION_TYPES.LIST_ITEM_REMOVED, itemId);
    }, 2000);
};
const removeListItemFromList = (items, itemId) => {
    return items.filter((item) => {
        return item.id !== itemId;
    });
};
const requestToChangePage = (dispatch, pageData) => {
    setTimeout(() => {
        dispatch(ACTION_TYPES.CHANGE_PAGE, pageData);
    }, 500);
};

module.exports = { requestToDeleteListItem, removeListItemFromList, requestToChangePage };

},{"./action_types":1}],3:[function(require,module,exports){
const bel = require('bel');
const raw = require('bel/raw');
const list = require('./list');
const listItem = require('./list_item');
const itemDetails = require('./item_details');

/*
 * Just a plain old function! Not concerned with
 * the framework.
 */
const getPageFromList = (offset, count, list) => {
    return list.slice(offset, offset + count);
};
const getListItemById = (id, list) => {
    return list.find((item) => {
        return item.id === id;
    });
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
        ${(state.selectedItemForDetails &&
            itemDetails(
                dispatch,
                getListItemById(state.selectedItemForDetails, state.items)
            )
        ) || ''}
    </main>`;
};
module.exports = AppComponent;

},{"./item_details":4,"./list":5,"./list_item":6,"bel":14,"bel/raw":15}],4:[function(require,module,exports){
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

},{"../../lib/util/apply_dispatch":11,"../action_types":1,"bel":14}],5:[function(require,module,exports){
const bel = require('bel');
const actions = require('../actions');
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
    actions.requestToChangePage(dispatch, { count : parseInt(count), offset : parseInt(offset) });
    dispatch(ACTION_TYPES.REQUEST_NEW_PAGE);
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

},{"../../lib/util/apply_dispatch":11,"../action_types":1,"../actions":2,"bel":14}],6:[function(require,module,exports){
const bel = require('bel');
const ACTION_TYPES = require('../action_types');
const actions = require('../actions');
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
    actions.requestToDeleteListItem(dispatch, itemId);
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

},{"../../lib/util/apply_dispatch":11,"../action_types":1,"../actions":2,"bel":14}],7:[function(require,module,exports){
const ACTION_TYPES = require('./action_types');
// const ROUTES = require('./routes');
// const { matchUrlToRoute } = require('./routing_tools');
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
        // case ACTION_TYPES.NAVIGATE_TO_URL:
        //     state.pending = true;
        //     state.url = actionData;
        //     matchUrlToRoute(ROUTES);
        case ACTION_TYPES.REQUEST_NEW_PAGE:
            state.pending = true;
            break;
        case ACTION_TYPES.CHANGE_PAGE:
            state.pending = false;
            state.count = actionData.count;
            state.offset = actionData.offset;
            break;
        case ACTION_TYPES.SHOW_LIST_ITEM_DETAILS:
            listItemId = actionData;
            state.selectedItemForDetails = listItemId;
            break;
        case ACTION_TYPES.HIDE_LIST_ITEM_DETAILS:
            state.selectedItemForDetails = null;
            break;
        case ACTION_TYPES.REMOVE_LIST_ITEM:
            state.pending = true;
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

},{"./action_types":1,"./actions":2}],8:[function(require,module,exports){
const App = require('./lib/app');
const AppComponent = require('./app/components/app_component');
const reducer = require('./app/reducer');

const myAppValidator = (state) => {
    let ret = false,
        errorsObj = {};
    if (state.offset < 0) {
        errorsObj.offset = "Offset cannot be lower than 0";
    }
    return Object.keys(errorsObj).length ? errorsObj : false;
};
const myAppFailHandler = (err, dispatch) => {
    /*
     * In all likelihood, we'll want
     * to dispatch an action here.
     * That means we need to pass
     * `dispatch`
     */
    console.log(err);
};


const myApp = new App({
    reducer : reducer,
    validator : myAppValidator,
    failHandler : myAppFailHandler,
    appRootId : 'appRoot',
    rootComponent : AppComponent 
}).setInitialState({
    items : [
        { id : 1, name : "Jack", bio : "Lorem ipsum dolor sit amet" },
        { id : 2, name : "Jill", bio : "There's nothing to see here" },
        { id : 3, name : "John", bio : "The miseducation of Lauryn Hill" },
        { id : 4, name : "Jennifer", bio : "This porridge is just right" },
        { id : 5, name : "Jillian", bio : "Till I spent some time on a river boat" }
    ],
    count : 2,
    offset : 0
});


},{"./app/components/app_component":3,"./app/reducer":7,"./lib/app":9}],9:[function(require,module,exports){
const AppState = require('./app_state');

class App {
    constructor(appProps) {
        const { reducer, validator, failHandler, appRootId, rootComponent } = appProps;
        this.state = new AppState(validator);
        this.unacceptableStateHandler = failHandler;
        this.reducer = reducer;
        this.baseComponent = rootComponent;
        this.appRootId = appRootId;
        this.dispatch = this.dispatch.bind(this);
    }

    changeState(newState) {
        try {
          this.state.propose(newState);
        } catch (err) {
          this.unacceptableStateHandler(err, this.dispatch);
        }
        this.render();
    }

    setInitialState(initialState) {
        this.changeState(initialState);
    }

    dispatch(actionName, actionData) {
        const newState = this.reducer(this.dispatch, this.state.data, actionName, actionData);
        this.changeState(newState);
    }

    /* TODO: we should have the option
     * of passing this in.
     */
    render() {
        document.body.replaceChild(
            this.baseComponent(this.dispatch, this.state.data),
            document.getElementById(this.appRootId)
        );
    }
};

module.exports = App;

},{"./app_state":10}],10:[function(require,module,exports){
const deepClone = require('./util/deep_clone');

class AppState {
  constructor(stateValidator) {
    this._data = {};
    this.stateValidator = stateValidator;
  }
  
  /*
   * Enforce immutability at the
   * framework level. Always clone.
   */
  get data() {
    return deepClone(this._data);
  }
  set data(data) {
    this._data = data;
    return this._data;
  }

  propose(newState) {
    let validatorError = this.stateValidator(newState);
    if (!validatorError) {
      /*
       * If we don't accept the
       * new state, that's fine.
       * We keep the previous one.
       */
      this.data = newState;
    } else {
      /* 
       * We don't have to do it this way,
       * but catching an error and 
       * dispatching a new action
       * makes some sense.
       */
      throw new Error(validatorError);
    }
  }
};

module.exports = AppState;

},{"./util/deep_clone":12}],11:[function(require,module,exports){
const applyDispatch = (fn, dispatch) => {
    return function() {
        return fn(dispatch, ...arguments);
    };
};
module.exports = applyDispatch;

},{}],12:[function(require,module,exports){
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = deepClone;

},{}],13:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var CODE_TAGS = [
  'code', 'pre'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (CODE_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],14:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":13,"hyperx":17}],15:[function(require,module,exports){
function rawCreateElement (tag) {
  if (typeof window !== 'undefined') {
    return browser()
  } else {
    return server()
  }

  function browser () {
    var el = document.createElement('div')
    el.innerHTML = tag
    return toArray(el.childNodes)
  }

  function server () {
    var wrapper = new String(tag) // eslint-disable-line no-new-wrappers
    wrapper.__encoded = true
    return wrapper
  }
}

function toArray (arr) {
  return Array.isArray(arr) ? arr : [].slice.call(arr)
}

module.exports = rawCreateElement

},{}],16:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],17:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":16}]},{},[8]);
