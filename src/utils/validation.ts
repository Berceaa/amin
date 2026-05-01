export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_ALLOWED_REGEX = /^[0-9+()\-\s]{7,20}$/;
const NAME_ALLOWED_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž\s'.-]+$/u;
const TAX_ALLOWED_REGEX = /^[A-Za-z0-9\-/.\s]{5,25}$/;

export type RegisterField = 'name' | 'email' | 'phone' | 'company' | 'taxNumber' | 'password' | 'confirmPassword';
export type LoginField = 'name' | 'password';
export type CheckoutField = 'firstName' | 'lastName' | 'email' | 'phone' | 'pickupStore' | 'pickupPerson' | 'notes';

export const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSpecial: /[^A-Za-z0-9]/,
};

export function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function validatePersonName(value: string, requiredMessage: string, invalidMessage: string, minLength = 2) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return requiredMessage;
  if (normalized.length < minLength) return invalidMessage;
  if (!NAME_ALLOWED_REGEX.test(normalized)) return invalidMessage;
  return '';
}

export function validateEmail(value: string, requiredMessage: string, invalidMessage: string) {
  const normalized = value.trim();
  if (!normalized) return requiredMessage;
  if (!EMAIL_REGEX.test(normalized)) return invalidMessage;
  return '';
}

export function validatePhone(value: string, requiredMessage: string, invalidMessage: string) {
  const normalized = value.trim();
  if (!normalized) return requiredMessage;
  const digits = normalized.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15 || !PHONE_ALLOWED_REGEX.test(normalized)) return invalidMessage;
  return '';
}

export function validateCompany(value: string, requiredMessage: string, invalidMessage: string) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return requiredMessage;
  if (normalized.length < 2) return invalidMessage;
  return '';
}

export function validateTaxNumber(value: string, requiredMessage: string, invalidMessage: string) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return requiredMessage;
  if (!TAX_ALLOWED_REGEX.test(normalized)) return invalidMessage;
  return '';
}

export function validatePassword(value: string, requiredMessage: string, weakMessage: string) {
  if (!value) return requiredMessage;
  const isStrong =
    value.length >= PASSWORD_RULES.minLength
    && PASSWORD_RULES.hasUppercase.test(value)
    && PASSWORD_RULES.hasLowercase.test(value)
    && PASSWORD_RULES.hasDigit.test(value)
    && PASSWORD_RULES.hasSpecial.test(value);

  return isStrong ? '' : weakMessage;
}

export function validateConfirmPassword(password: string, confirmPassword: string, requiredMessage: string, mismatchMessage: string) {
  if (!confirmPassword) return requiredMessage;
  if (password !== confirmPassword) return mismatchMessage;
  return '';
}

export function validatePickupStore(value: string, requiredMessage: string, invalidMessage: string) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return requiredMessage;
  if (normalized.length < 3) return invalidMessage;
  return '';
}

export function validateNotes(value: string, tooLongMessage: string) {
  if (value.trim().length > 240) return tooLongMessage;
  return '';
}

export function getPasswordChecks(password: string) {
  return {
    minLength: password.length >= PASSWORD_RULES.minLength,
    uppercase: PASSWORD_RULES.hasUppercase.test(password),
    lowercase: PASSWORD_RULES.hasLowercase.test(password),
    digit: PASSWORD_RULES.hasDigit.test(password),
    special: PASSWORD_RULES.hasSpecial.test(password),
  };
}
