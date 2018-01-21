const applyDispatch = (fn, dispatch) => {
    return function() {
        return fn(dispatch, ...arguments);
    };
};
module.exports = applyDispatch;
