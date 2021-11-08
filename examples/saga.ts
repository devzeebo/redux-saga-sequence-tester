import {
  call,
  put,
  takeEvery,
} from 'typed-redux-saga';
import {
  Action,
} from '@reduxjs/toolkit';
import {
  isError,
} from 'lodash/fp';
import api from './api';
import beginEdit from './domain/events/beginEdit';
import {
  beginUpdate,
  valueUpdated,
} from './domain/events/updateName';
import globalError from './domain/events/globalError';
import takeAction from './effects/takeAction';

export function* exampleSaga(value: Action) {
  if (!beginEdit.match(value)) {
    throw new Error(`Expected value to be beginUpdate action but was ${JSON.stringify(value)}`);
  }

  const domainId = value.payload;

  const { newName } = yield* takeAction(beginUpdate, (update) => update.id === domainId);

  try {
    const result = yield* call(api, value.payload, newName);

    yield* put(valueUpdated(result));
  } catch (e) {
    if (isError(e)) {
      yield* put(globalError(e.message));
    } else {
      // eslint-disable-next-line no-console
      console.error('Unknown error', e);
    }
  }
}

export default function* watchForUpdate() {
  return yield* takeEvery(beginEdit, exampleSaga);
}
