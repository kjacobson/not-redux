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
