import run from 'ember-metal/run_loop';
import get from 'ember-metal/property_get';
import EmberObject from 'ember-runtime/system/object';
import Mixin from 'ember-metal/mixin';

QUnit.module('Ember.Mixin#reopen');

test('using reopen() to add more properties to a simple', function() {
  var MixinA = Mixin.create({ foo: 'FOO', baz: 'BAZ' });
  MixinA.reopen({ bar: 'BAR', foo: 'FOO2' });
  var obj = {};
  MixinA.apply(obj);

  equal(get(obj, 'foo'), 'FOO2', 'mixin() should override');
  equal(get(obj, 'baz'), 'BAZ', 'preserve MixinA props');
  equal(get(obj, 'bar'), 'BAR', 'include MixinB props');
});

test('using reopen() and calling _super where there is not a super function does not cause infinite recursion', function(){
  var Taco = EmberObject.extend({
    createBreakfast: function(){
      // There is no original createBreakfast function.
      // Calling the wrapped _super function here
      // used to end in an infinite call loop
      this._super.apply(this, arguments);
      return "Breakfast!";
    }
  });

  Taco.reopen({
    createBreakfast: function(){
      return this._super.apply(this, arguments);
    }
  });

  var taco = Taco.create();

  var result;
  run(function(){
    try {
      result = taco.createBreakfast();
    } catch (e) {
      result = "Your breakfast was interrupted by an infinite stack error.";
    }
  });

  equal(result, "Breakfast!");
});

