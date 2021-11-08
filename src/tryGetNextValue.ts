import {
  EffectHandlerResult,
} from './EffectHandlerDefinition';

export default async (
  getNextValue: () => Promise<EffectHandlerResult>,
): Promise<EffectHandlerResult> => {
  try {
    return await getNextValue();
  } catch (e: any) {
    return {
      nextAction: 'throw',
      result: e,
    };
  }
};
