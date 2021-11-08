import test from 'jest-gwt';
import {
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import SagaSequencer from 'redux-saga-sequence-tester';
import {
  take,
} from 'typed-redux-saga';
import takeAction from './takeAction';

describe('effects > take action', () => {
  test('listens to the action type', {
    scenario: {
      when_taking_action,
      then_takes_creator,
      then_payload_returned,
    },
  });

  test('when filters actions', {
    given: {
      when_filter,
    },
    scenario: {
      when_taking_action,
      when_taking_creator_that_FAILS_FILTER,
      then_takes_creator,
      then_payload_returned,
    },
  });
});

const action_creator = createAction<string>('action');

type Context = {
  action: PayloadAction<string>,
  when_filter: (payload: string) => boolean,

  generator: SagaSequencer<string>,
};

function when_filter(this: Context) {
  this.when_filter = (payload: string) => (
    payload.length > 3
  );
}

function when_taking_action(this: Context) {
  this.generator = new SagaSequencer(takeAction(
    action_creator,
    this.when_filter,
  ));
}

async function then_takes_creator(this: Context) {
  expect(await this.generator.next(action_creator('data')))
    .toEqual(take(action_creator).next().value);
}

async function when_taking_creator_that_FAILS_FILTER(this: Context) {
  expect(await this.generator.next(action_creator('c')))
    .toEqual(take(action_creator).next().value);
}

async function then_payload_returned(this: Context) {
  expect(await this.generator.next())
    .toEqual('data');
}
