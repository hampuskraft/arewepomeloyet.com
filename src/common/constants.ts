export enum CallbackCode {
  Success,
  NotEligible,
  NotEligibleFlags,
  AlreadyRegistered,
  StateMismatch,
  InvalidCode,
  UnknownError,
}

export const CallbackCodeToMessage: Record<CallbackCode, string> = {
  [CallbackCode.Success]: "You've successfully registered your Pomelo.",
  [CallbackCode.NotEligible]: "You haven't been Pomelo'd yet. Try again when you are.",
  [CallbackCode.NotEligibleFlags]: "We can't accept Pomelos from staff or partners.",
  [CallbackCode.AlreadyRegistered]: "You've already registered your Pomelo.",
  [CallbackCode.StateMismatch]: "Your OAuth state doesn't match.",
  [CallbackCode.InvalidCode]: 'Your OAuth code is invalid.',
  [CallbackCode.UnknownError]: 'An unknown error occurred. Try again?',
};
