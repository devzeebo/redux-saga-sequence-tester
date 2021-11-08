import type {
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import {
  take,
} from 'typed-redux-saga';

export type TakeAction<T> = T extends ActionCreatorWithPayload<infer TPayload>
  ? TPayload
  : never;

export default function* takeAction<
T extends ActionCreatorWithPayload<TPayload>,
TPayload = TakeAction<T>
>(
  creator: T,
  when?: (payload: TPayload) => boolean,
) {
  while (true) {
    const result = yield* take(creator);

    if (!when || when(result.payload)) {
      return result.payload;
    }
  }
}
