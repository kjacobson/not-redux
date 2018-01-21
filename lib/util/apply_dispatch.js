const applyDispatch = (fn, dispatch) => {
    return (arg) => {
        return fn(arg, dispatch);
    };
};
module.exports = applyDispatch;
