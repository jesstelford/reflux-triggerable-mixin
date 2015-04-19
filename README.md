# Reflux Triggerable Mixin

Mixin for [reflux](https://www.npmjs.com/packages/reflux) stores to enable quick
creation of triggerable events on a store. Similar to the built-in
`listenables`, but for triggering.

## Usage

```javascript
// myStore.js
var Reflux = require('reflux'),
    triggerablesMixin = require('reflux-triggerable-mixin')(Reflux);

module.exports = Reflux.createStore({

  mixins: [triggerablesMixin],

  listenables: {
    something: Reflux.createAction()
  },

  // The mixin turns each of these into a named action on the store.
  triggerables: [
    'somethingHappened'
  ],
  // --- OR ---
  triggerables: {
    'somethingHappened': {<refulx action options>}
  },

  onSomething: function() {
    this.somethingHappened.trigger('foo');
  }

});
```

```javascript
// myComponent.js
var myStore = require('./myStore.js');

myStore.somethingHappened.listen(function(what) {
  console.log(what + ' happened');
});
```

## Installation

```bash
$ npm install --save reflux-triggerable-mixin
```
