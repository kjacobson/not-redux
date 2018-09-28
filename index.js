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

