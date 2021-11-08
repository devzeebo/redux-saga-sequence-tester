import { createAction } from '@reduxjs/toolkit';
import test from 'jest-gwt';
import type {
  TakeEffect,
} from 'redux-saga/effects';
import {
  call,
  put,
  take,
  SagaGenerator,
} from 'typed-redux-saga';
import { EffectHandlerDefinition } from './EffectHandlerDefinition';
import SagaSequencer from './SagaSequencer';

describe('saga sequencer', () => {
  test('next returns yielded result', {
    given: {
      simple_saga,
    },
    scenario: {
      when_creating_sequencer,
      then_next_is_FIRST_YIELD,
      then_next_is_SECOND_YIELD,
      then_next_is_THIRD_YIELD,
    },
  });

  test('overrides return value', {
    given: {
      simple_saga_WITH_YIELD_RESULTS,
    },
    scenario: {
      when_creating_sequencer,
      then_next_is_FIRST_YIELD,
      when_overriding_SECOND_YIELD,
      when_overriding_THIRD_YIELD,
      then_result_is_LAST_OVERRIDE,
    },
  });

  test('uses effect handler', {
    given: {
      simple_saga_WITH_YIELD_RESULTS,
      effect_handler,
    },
    scenario: {
      when_creating_sequencer_WITH_HANDLERS,
      then_next_is_FIRST_YIELD,
      then_next_is_OVERRIDDEN_YIELD,
      then_next_is_CALL_with_OVERRIDEN_BY_HANDLER,
    },
  });
});

type Context = {
  saga: () => SagaGenerator<any>,
  handlers: Array<EffectHandlerDefinition>,

  sequencer: SagaSequencer<any>
};

const action_creator = createAction<string>('action');

const fetch = (
  url: string,
  opts: RequestInit,
) => Promise.resolve({ url, opts });

function simple_saga(this: Context) {
  this.saga = function* saga() {
    yield* put(action_creator('one'));
    yield* put(action_creator('two'));
    yield* put(action_creator('three'));
  };
}

function effect_handler(this: Context) {
  this.handlers = [
    {
      matcher: (effect: TakeEffect) => (
        effect?.type === 'TAKE'
        && effect.payload.pattern === action_creator
      ),
      handler: (/* effect */) => () => Promise.resolve({
        nextAction: 'next',
        result: action_creator('overridden by handler'),
      }),
    },
  ];
}

function simple_saga_WITH_YIELD_RESULTS(this: Context) {
  this.saga = function* saga() {
    yield* put(action_creator('one'));

    const { payload: result } = yield* take(action_creator);

    return yield* call(fetch, '/api/v1', { body: result });
  };
}

function when_creating_sequencer(this: Context) {
  this.sequencer = new SagaSequencer(this.saga());
}

function when_creating_sequencer_WITH_HANDLERS(this: Context) {
  this.sequencer = new SagaSequencer(this.saga(), { handlers: this.handlers });
}

async function then_next_is_FIRST_YIELD(this: Context) {
  expect(await this.sequencer.next())
    .toEqual(put(action_creator('one')).next().value);
}

async function then_next_is_SECOND_YIELD(this: Context) {
  expect(await this.sequencer.next())
    .toEqual(put(action_creator('two')).next().value);
}

async function then_next_is_THIRD_YIELD(this: Context) {
  expect(await this.sequencer.next())
    .toEqual(put(action_creator('three')).next().value);
}

async function when_overriding_SECOND_YIELD(this: Context) {
  expect(await this.sequencer.next(action_creator('override second')))
    .toEqual(take(action_creator).next().value);
}

async function when_overriding_THIRD_YIELD(this: Context) {
  expect(await this.sequencer.next('call result'))
    .toEqual(call(fetch, '/api/v1', { body: 'override second' }).next().value);
}

async function then_result_is_LAST_OVERRIDE(this: Context) {
  expect(await this.sequencer.next())
    .toEqual('call result');
}

async function then_next_is_OVERRIDDEN_YIELD(this: Context) {
  expect(await this.sequencer.next())
    .toEqual(take(action_creator).next().value);
}

async function then_next_is_CALL_with_OVERRIDEN_BY_HANDLER(this: Context) {
  expect(await this.sequencer.next())
    .toEqual(call(fetch, '/api/v1', { body: 'overridden by handler' }).next().value);
}
