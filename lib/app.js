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
          this.unacceptableStateHandler(err);
        }
        this.render();
    }

    setInitialState(initialState) {
        this.changeState(initialState);
    }

    dispatch(actionName, actionData) {
        const newState = this.reducer(this.state.data, actionName, actionData, this.dispatch);
        this.changeState(newState);
    }

    render() {
        document.body.replaceChild(
            this.baseComponent(this.state.data, this.dispatch),
            document.getElementById(this.appRootId)
        );
    }
};

module.exports = App;
