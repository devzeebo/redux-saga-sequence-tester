import {
  find,
  flow,
  getOr,
  isEmpty,
} from 'lodash/fp';
import type {
  SagaGenerator,
} from 'typed-redux-saga';
import type {
  EffectHandlerDefinition,
  EffectHandlerResult,
} from './EffectHandlerDefinition';

import defaultEffectHandler from './defaultEffectHandler';
import tryGetNextValue from './tryGetNextValue';

export type SagaSequencerOptions = {
  handlers?: Array<EffectHandlerDefinition>,
};

export default class SagaSequencer<T> {
  private effectHandlers?: Array<EffectHandlerDefinition>;

  private getNextValue: () => Promise<EffectHandlerResult> = defaultEffectHandler(undefined)();

  constructor(
    private saga: SagaGenerator<T>,
    {
      handlers,
    }: SagaSequencerOptions = {},
  ) {
    this.effectHandlers = handlers;
  }

  public async next(returnValue: any = undefined) {
    const {
      nextAction,
      result: previousResult,
    } = await tryGetNextValue(this.getNextValue);

    const result = this.saga[nextAction](previousResult);

    this.getNextValue = flow(
      find(({ matcher: effectMatcher }: EffectHandlerDefinition) => (
        effectMatcher(result.value, returnValue)
      )),
      getOr(defaultEffectHandler(returnValue), 'handler'),
      (handler) => handler(result.value),
    )(this.effectHandlers);

    return result.value;
  }
}
