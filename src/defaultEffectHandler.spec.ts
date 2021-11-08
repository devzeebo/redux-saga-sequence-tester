import test from 'jest-gwt';
import defaultEffectHandler from './defaultEffectHandler';
import { EffectHandlerResult } from './EffectHandlerDefinition';

describe('default effect handler', () => {
  test('returns next', {
    given: {
      return_value,
    },
    when: {
      handling_effect,
    },
    then: {
      next_action_is_NEXT,
      result_is_RESULT,
    },
  });

  test('next action is THROW if return value is ERROR', {
    given: {
      return_value_is_ERROR,
    },
    when: {
      handling_effect,
    },
    then: {
      next_action_is_THROW,
      result_is_ERROR,
    },
  });
});

type Context = {
  return_value: any,
  result: EffectHandlerResult
};

function return_value(this: Context) {
  this.return_value = Symbol.for('result');
}

function return_value_is_ERROR(this: Context) {
  this.return_value = new Error('oops!');
}

async function handling_effect(this: Context) {
  this.result = await defaultEffectHandler(this.return_value)(/* effect */)();
}

function next_action_is_NEXT(this: Context) {
  expect(this.result.nextAction).toBe('next');
}

function next_action_is_THROW(this: Context) {
  expect(this.result.nextAction).toBe('throw');
}

function result_is_RESULT(this: Context) {
  expect(this.result.result).toBe(Symbol.for('result'));
}

function result_is_ERROR(this: Context) {
  expect(this.result.result).toEqual(new Error('oops!'));
}
