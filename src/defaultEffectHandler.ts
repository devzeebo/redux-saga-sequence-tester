import {
  isError,
} from 'lodash/fp';
import {
  EffectHandler,
  EffectHandlerResult,
} from './EffectHandlerDefinition';

export default <T>(result: T): EffectHandler => (
  /* effect */
) => (
  (): Promise<EffectHandlerResult> => {
    if (isError(result)) {
      return Promise.resolve({
        nextAction: 'throw',
        result,
      });
    }

    return Promise.resolve({
      nextAction: 'next',
      result,
    });
  }
);
