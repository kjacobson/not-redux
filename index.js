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
const myAppFailHandler = (err) => {
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
        { id : 0, name : "Jack" },
        { id : 1, name : "Jill" },
        { id : 2, name : "John" },
        { id : 3, name : "Jennifer" },
        { id : 4, name : "Jillian" }
    ],
    count : 2,
    offset : 0
});

