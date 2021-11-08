export type EffectHandlerResult<T = unknown> = {
  nextAction: 'next',
  result: T
} | {
  nextAction: 'throw',
  result: Error
};

export type EffectHandler<T = unknown> = (effect?: any) => (
  () => Promise<EffectHandlerResult<T>>
);

export type EffectHandlerDefinition = {
  matcher: (effect: any, returnValue: any) => boolean,
  handler: EffectHandler;
};
