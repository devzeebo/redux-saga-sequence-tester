import test from 'jest-gwt';
import { EffectHandlerResult } from './EffectHandlerDefinition';
import tryGetNextValue from './tryGetNextValue';

describe('try get next value', () => {
  test('returns result', {
    given: {
      get_next_value_fn,
    },
    when: {
      trying_to_get_next_value,
    },
    then: {
      result_is_FN_RESULT,
    },
  });

  test('catches errors', {
    given: {
      get_next_value_fn_THROWS_ERROR,
    },
    when: {
      trying_to_get_next_value,
    },
    then: {
      result_is_ERROR,
    },
  });
});

type Context = {
  fn: () => Promise<EffectHandlerResult>,

  result: any
};

function get_next_value_fn(this: Context) {
  this.fn = jest.fn().mockResolvedValue({
    nextAction: 'next',
    result: Symbol.for('result'),
  });
}

function get_next_value_fn_THROWS_ERROR(this: Context) {
  this.fn = jest.fn().mockRejectedValue(new Error('oops!'));
}

async function trying_to_get_next_value(this: Context) {
  this.result = await tryGetNextValue(this.fn);
}

function result_is_FN_RESULT(this: Context) {
  expect(this.result.nextAction).toEqual('next');
  expect(this.result.result).toEqual(Symbol.for('result'));
}

function result_is_ERROR(this: Context) {
  expect(this.result.nextAction).toEqual('throw');
  expect(this.result.result).toEqual(new Error('oops!'));
}
