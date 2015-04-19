'use strict';

/**
 * Creates the mixin, ready for use in a store
 *
 * @param Reflux object An instance of Reflux
 */
module.exports = function triggerablesMixin(Reflux) {

  if (typeof Reflux !== 'object' || typeof Reflux.createAction !== 'function') {
    throw new Error('Must pass reflux instance to reflux-triggerables-mixin');
  }

  function attachAction(options, actionName) {
    if (this[actionName]) {
      console.warn(
        'Not attaching event '
        + actionName
        + '; key already exists'
      );
      return;
    }
    this[actionName] = Reflux.createAction(options);
  }

  return {
    init() {

      var actionName,
          toString = Object.prototype.toString;

      if (!this.triggerables) {
        return;
      }

      if (toString.call(this.triggerables) === '[object Array]') {
        // attach the given action names as actions on the store
        this.triggerables.forEach(attachAction.bind(this, {}));
      } else if (typeof this.triggerables === 'object') {
        for (actionName in this.triggerables) {
          if (this.triggerables.hasOwnProperty(actionName)) {
            attachAction.call(this, this.triggerables[actionName], actionName);
          }
        }
      }

    }
  };
};
