import test from 'jest-gwt';
import SagaSequencer from 'redux-saga-sequence-tester';
import {
  Action,
} from '@reduxjs/toolkit';
import {
  call,
  put,
  take,
} from 'typed-redux-saga';
import {
  beginUpdate, valueUpdated,
} from './domain/events/updateName';
import api from './api';
import {
  exampleSaga,
} from './saga';
import globalError from './domain/events/globalError';
import beginEdit from './domain/events/beginEdit';

describe('example > saga', () => {
  test('happy path', {
    given: {
      begin_edit_action,
    },
    scenario: {
      when_running_saga,
      when_receiving_update_name,
      when_update_api_SUCCEEDS,
      then_value_is_updated,
    },
  });

  test('ignores actions that do NOT match id', {
    given: {
      begin_edit_action,
    },
    scenario: {
      when_running_saga,
      when_receiving_update_name_for_DIFFERENT_ID,
      then_still_waiting_for_update_name,
    },
  });

  test('api failure', {
    given: {
      begin_edit_action,
    },
    scenario: {
      when_running_saga,
      when_receiving_update_name,
      when_update_api_FAILS,
      then_error_logged,
    },
  });
});

type Context = {
  action: Action,
  saga: SagaSequencer<void>
};

function begin_edit_action(this: Context) {
  this.action = beginEdit('123-abc');
}

function when_running_saga(this: Context) {
  this.saga = new SagaSequencer(exampleSaga(this.action));
}

async function when_receiving_update_name(this: Context) {
  expect(await this.saga.next(beginUpdate({
    id: '123-abc',
    newName: 'new name',
  })))
    .toEqual(take(beginUpdate).next().value);
}

async function when_receiving_update_name_for_DIFFERENT_ID(this: Context) {
  expect(await this.saga.next(beginUpdate({
    id: '456-def',
    newName: 'new name',
  })))
    .toEqual(take(beginUpdate).next().value);
}

async function when_update_api_SUCCEEDS(this: Context) {
  expect(await this.saga.next({
    id: '123-abc',
    name: 'resolved name',
  }))
    .toEqual(call(api, '123-abc', 'new name').next().value);
}

async function when_update_api_FAILS(this: Context) {
  expect(await this.saga.next(new Error('oops!')))
    .toEqual(call(api, '123-abc', 'new name').next().value);
}

async function then_value_is_updated(this: Context) {
  expect(await this.saga.next())
    .toEqual(put(valueUpdated({
      id: '123-abc',
      name: 'resolved name',
    })).next().value);
}

async function then_error_logged(this: Context) {
  expect(await this.saga.next())
    .toEqual(put(globalError('oops!')).next().value);
}

async function then_still_waiting_for_update_name(this: Context) {
  expect(await this.saga.next())
    .toEqual(take(beginUpdate).next().value);
}
