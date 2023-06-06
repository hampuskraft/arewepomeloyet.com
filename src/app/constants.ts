export enum CallbackCode {
  Success,
  NotEligible,
  NotEligibleStaff,
  NotEligiblePartner,
  AlreadyRegistered,
  StateMismatch,
  InvalidCode,
  UnknownError,
}

export const CallbackCodeToMessage: Record<CallbackCode, string> = {
  [CallbackCode.Success]: "You've successfully registered your Pomelo!",
  [CallbackCode.NotEligible]:
    "You haven't been Pomelo'd yet! Try again when you have been.",
  [CallbackCode.NotEligibleStaff]:
    "You're a staff member! We can't count your Pomelo.",
  [CallbackCode.NotEligiblePartner]:
    "You're a partner! We can't count your Pomelo.",
  [CallbackCode.AlreadyRegistered]: "You've already registered your Pomelo!",
  [CallbackCode.StateMismatch]: "Your OAuth state doesn't match!",
  [CallbackCode.InvalidCode]: "Your OAuth code is invalid!",
  [CallbackCode.UnknownError]: "An unknown error occurred! Try again?",
};
