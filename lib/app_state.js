const deepClone = require('./util/deep_clone');

class AppState {
  constructor(stateValidator) {
    this._data = {};
    this.stateValidator = stateValidator;
  }
  
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
      this.data = newState;
    } else {
      throw new Error(validatorError);
    }
  }
};

module.exports = AppState;
