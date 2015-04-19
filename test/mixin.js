/*eslint-env mocha */
'use strict';

var sinon = require('sinon'),
    expect = require('chai').expect,
    triggerables = require('../lib/index');

describe('instantiation', () => {

  it('throws when not passed any parameter', () => {
    expect(() => triggerables()).to.throw(/Must pass reflux/);
  });

  it('throws when passed incorrect parameter', () => {
    expect(() => triggerables('foo')).to.throw(/Must pass reflux/);
  });

  it('throws when passed incorrect object parameter', () => {
    expect(() => triggerables({})).to.throw(/Must pass reflux/);
  });

  it('does not throw when passed reflux', () => {
    var reflux = {
      createAction: () => {}
    };
    expect(() => triggerables(reflux)).to.not.throw(Error);
  });

  it('returns a mixin for `init`', () => {
    var reflux = {
      createAction: () => {}
    };
    var mixin = triggerables(reflux);
    expect(mixin.init).to.be.a('function');
  });
});

describe('usage', () => {

  var reflux = {};

  beforeEach('create mock reflux', () => {
    reflux.createAction = sinon.stub().returns(() => {});
  });

  describe('mixing in', () => {

    it('does not throw when no triggerables set', () => {
      var mixin = triggerables(reflux);
      var target = {};
      expect(() => mixin.init.call(target)).to.not.throw(Error);
    });

    it('does not throw when empty triggerables set', () => {
      var mixin = triggerables(reflux);
      var target = {
        triggerables: null
      };
      expect(() => mixin.init.call(target)).to.not.throw(Error);
    });

    it('adds actions when triggerables is an array', () => {
      var mixin = triggerables(reflux);
      var target = {
        triggerables: ['foo']
      };
      expect(() => mixin.init.call(target)).to.not.throw(Error);
      expect(target.foo).to.be.a('function');
      expect(reflux.createAction.calledOnce).to.be.equal(true);
    });

    it('uses empty object for options when array of triggerables', () => {
      var mixin = triggerables(reflux);
      var target = {
        triggerables: ['foo']
      };
      mixin.init.call(target);
      expect(reflux.createAction.args[0][0]).to.be.eql({});
    });

    it('uses correct object for options when object of triggerables', () => {
      var mixin = triggerables(reflux);
      var target = {
        triggerables: {
          'foo': {bar: 'bar'}
        }
      };
      mixin.init.call(target);
      expect(reflux.createAction.args[0][0]).to.be.eql({bar: 'bar'});
    });

    describe('warnings', () => {
      var mockWarn;
      before('mock console.warn', () => {
        mockWarn = sinon.spy(console, 'warn');
      });

      after('restore console.warn', () => {
        mockWarn.restore();
      });

      it('warns when key already exists on target', () => {
        var mixin = triggerables(reflux);
        var target = {
          foo: 'bar',
          triggerables: ['foo']
        };
        mixin.init.call(target);
        expect(reflux.createAction.called).to.be.equal(false);
        expect(mockWarn.calledOnce).to.be.equal(true);
      });
    });

  });

});
