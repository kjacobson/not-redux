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
