import { useMemo, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import {
  getPasswordChecks,
  normalizeSpaces,
  validateCompany,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePersonName,
  validatePhone,
  validateTaxNumber,
  type LoginField,
  type RegisterField,
  type ValidationErrors,
} from '../utils/validation';

type Mode = 'login' | 'register';

type LoginForm = {
  name: string;
  password: string;
};

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  taxNumber: string;
  password: string;
  confirmPassword: string;
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { login, register, user, logout } = useAuth();
  const mode: Mode = location.pathname.includes('register') ? 'register' : 'login';
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginForm, setLoginForm] = useState<LoginForm>({ name: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    taxNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loginErrors, setLoginErrors] = useState<ValidationErrors<LoginField>>({});
  const [registerErrors, setRegisterErrors] = useState<ValidationErrors<RegisterField>>({});
  const [loginTouched, setLoginTouched] = useState<Partial<Record<LoginField, boolean>>>({});
  const [registerTouched, setRegisterTouched] = useState<Partial<Record<RegisterField, boolean>>>({});

  const passwordChecks = useMemo(() => getPasswordChecks(registerForm.password), [registerForm.password]);

  const loginValidationMessages = useMemo(() => ({
    nameRequired: t('validation.nameRequired') as string,
    nameInvalid: t('validation.nameInvalid') as string,
    passwordRequired: t('validation.passwordRequired') as string,
  }), [t]);

  const registerValidationMessages = useMemo(() => ({
    nameRequired: t('validation.nameRequired') as string,
    nameInvalid: t('validation.nameInvalid') as string,
    emailRequired: t('validation.emailRequired') as string,
    emailInvalid: t('validation.emailInvalid') as string,
    phoneRequired: t('validation.phoneRequired') as string,
    phoneInvalid: t('validation.phoneInvalid') as string,
    companyRequired: t('validation.companyRequired') as string,
    companyInvalid: t('validation.companyInvalid') as string,
    taxRequired: t('validation.taxRequired') as string,
    taxInvalid: t('validation.taxInvalid') as string,
    passwordRequired: t('validation.passwordRequired') as string,
    passwordWeak: t('validation.passwordWeak') as string,
    confirmPasswordRequired: t('validation.confirmPasswordRequired') as string,
    passwordMismatch: t('validation.passwordMismatch') as string,
  }), [t]);

  const validateLoginField = (field: LoginField, value: string): string => {
    if (field === 'name') {
      return validatePersonName(value, loginValidationMessages.nameRequired, loginValidationMessages.nameInvalid);
    }

    if (field === 'password' && !value) {
      return loginValidationMessages.passwordRequired;
    }

    return '';
  };

  const validateRegisterField = (field: RegisterField, form: RegisterForm): string => {
    switch (field) {
      case 'name':
        return validatePersonName(form.name, registerValidationMessages.nameRequired, registerValidationMessages.nameInvalid);
      case 'email':
        return validateEmail(form.email, registerValidationMessages.emailRequired, registerValidationMessages.emailInvalid);
      case 'phone':
        return validatePhone(form.phone, registerValidationMessages.phoneRequired, registerValidationMessages.phoneInvalid);
      case 'company':
        return validateCompany(form.company, registerValidationMessages.companyRequired, registerValidationMessages.companyInvalid);
      case 'taxNumber':
        return validateTaxNumber(form.taxNumber, registerValidationMessages.taxRequired, registerValidationMessages.taxInvalid);
      case 'password':
        return validatePassword(form.password, registerValidationMessages.passwordRequired, registerValidationMessages.passwordWeak);
      case 'confirmPassword':
        return validateConfirmPassword(
          form.password,
          form.confirmPassword,
          registerValidationMessages.confirmPasswordRequired,
          registerValidationMessages.passwordMismatch,
        );
      default:
        return '';
    }
  };

  const validateLoginForm = (form: LoginForm) => {
    const nextErrors: ValidationErrors<LoginField> = {
      name: validateLoginField('name', form.name),
      password: validateLoginField('password', form.password),
    };

    return Object.fromEntries(Object.entries(nextErrors).filter(([, value]) => value)) as ValidationErrors<LoginField>;
  };

  const validateRegisterForm = (form: RegisterForm) => {
    const fields: RegisterField[] = ['name', 'email', 'phone', 'company', 'taxNumber', 'password', 'confirmPassword'];
    const nextErrors = fields.reduce<ValidationErrors<RegisterField>>((acc, field) => {
      const errorText = validateRegisterField(field, form);
      if (errorText) acc[field] = errorText;
      return acc;
    }, {});

    return nextErrors;
  };

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginForm((current) => {
      const nextForm = { ...current, [name]: value };
      if (loginTouched[name as LoginField]) {
        setLoginErrors((currentErrors) => ({
          ...currentErrors,
          [name]: validateLoginField(name as LoginField, value),
        }));
      }
      return nextForm;
    });
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterForm((current) => {
      const nextForm = { ...current, [name]: value };
      if (registerTouched[name as RegisterField] || (name === 'password' && registerTouched.confirmPassword)) {
        setRegisterErrors(validateRegisterForm(nextForm));
      }
      return nextForm;
    });
  };

  const handleLoginBlur = (field: LoginField) => {
    setLoginTouched((current) => ({ ...current, [field]: true }));
    setLoginErrors((current) => ({ ...current, [field]: validateLoginField(field, loginForm[field]) }));
  };

  const handleRegisterBlur = (field: RegisterField) => {
    setRegisterTouched((current) => ({ ...current, [field]: true }));
    setRegisterErrors(validateRegisterForm(registerForm));
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const nextErrors = validateLoginForm(loginForm);
    setLoginTouched({ name: true, password: true });
    setLoginErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = login({
      name: normalizeSpaces(loginForm.name),
      password: loginForm.password,
    });

    if (!result.ok) {
      setError(result.message || 'Unable to login.');
      return;
    }

    setMessage(t('auth.loginSuccess') as string);
    navigate('/checkout');
  };

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const nextErrors = validateRegisterForm(registerForm);
    setRegisterTouched({
      name: true,
      email: true,
      phone: true,
      company: true,
      taxNumber: true,
      password: true,
      confirmPassword: true,
    });
    setRegisterErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = register({
      name: normalizeSpaces(registerForm.name),
      email: registerForm.email.trim(),
      phone: registerForm.phone.trim(),
      company: normalizeSpaces(registerForm.company),
      taxNumber: normalizeSpaces(registerForm.taxNumber),
      password: registerForm.password,
    });

    if (!result.ok) {
      setError(result.message || 'Unable to register.');
      return;
    }

    setMessage(t('auth.registerSuccess') as string);
    navigate('/checkout');
  };

  if (user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14 lg:px-6">
        <section className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm md:p-10"><PawTrail className="mb-6" size="sm" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Account</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">{t('nav.account') as string}</h1>
          <p className="mt-4 text-slate-600">{t('auth.loggedInAs') as string}: <span className="font-semibold text-slate-900">{user.name}</span></p>
          <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-5 md:grid-cols-2">
            <Info label={t('auth.email') as string} value={user.email} />
            <Info label={t('auth.phone') as string} value={user.phone} />
            <Info label={t('auth.company') as string} value={user.company} />
            <Info label={t('auth.taxNumber') as string} value={user.taxNumber} />
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/checkout" className="paw-button rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">Checkout</Link>
            <button
              type="button"
              onClick={() => {
                logout();
                setMessage(t('auth.logoutMessage') as string);
              }}
              className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800"
            >
              {t('nav.logout') as string}
            </button>
          </div>
          {message && <p className="mt-4 text-sm font-medium text-[#f27128]">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm md:p-10"><PawTrail className="mb-6" size="sm" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Pawsentials</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">
            {mode === 'login' ? (t('auth.loginTitle') as string) : (t('auth.registerTitle') as string)}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {mode === 'login' ? (t('auth.loginDesc') as string) : (t('auth.registerDesc') as string)}
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-[#fff7f1] p-5 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">B2B-friendly pickup flow</p>
            <p className="mt-2">Orders are configured for in-store pickup only, and customer data persists locally in the browser for demo purposes.</p>
          </div>
          {mode === 'register' && (
            <div className="mt-6 rounded-[1.5rem] border border-orange-100 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">{t('validation.passwordHelperTitle') as string}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <PasswordRule ok={passwordChecks.minLength} text={t('validation.passwordRuleLength') as string} />
                <PasswordRule ok={passwordChecks.uppercase} text={t('validation.passwordRuleUppercase') as string} />
                <PasswordRule ok={passwordChecks.lowercase} text={t('validation.passwordRuleLowercase') as string} />
                <PasswordRule ok={passwordChecks.digit} text={t('validation.passwordRuleDigit') as string} />
                <PasswordRule ok={passwordChecks.special} text={t('validation.passwordRuleSpecial') as string} />
              </ul>
            </div>
          )}
        </section>

        <section className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm md:p-10"><PawTrail className="mb-6" size="sm" />
          {mode === 'login' ? (
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              <Input
                label={t('auth.name') as string}
                name="name"
                value={loginForm.name}
                onChange={handleLoginChange}
                onBlur={() => handleLoginBlur('name')}
                error={loginTouched.name ? loginErrors.name : ''}
              />
              <Input
                label={t('auth.password') as string}
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                onBlur={() => handleLoginBlur('password')}
                error={loginTouched.password ? loginErrors.password : ''}
              />
              <button type="submit" className="w-full rounded-full bg-[#f27128] px-6 py-3.5 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
                {t('auth.submitLogin') as string}
              </button>
              <Link to="/register" className="block text-center text-sm font-semibold text-[#f27128]">
                {t('auth.switchToRegister') as string}
              </Link>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate className="grid gap-5 md:grid-cols-2">
              <Input label={t('auth.name') as string} name="name" value={registerForm.name} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('name')} error={registerTouched.name ? registerErrors.name : ''} />
              <Input label={t('auth.email') as string} name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('email')} error={registerTouched.email ? registerErrors.email : ''} />
              <Input label={t('auth.phone') as string} name="phone" value={registerForm.phone} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('phone')} error={registerTouched.phone ? registerErrors.phone : ''} />
              <Input label={t('auth.company') as string} name="company" value={registerForm.company} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('company')} error={registerTouched.company ? registerErrors.company : ''} />
              <Input label={t('auth.taxNumber') as string} name="taxNumber" value={registerForm.taxNumber} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('taxNumber')} error={registerTouched.taxNumber ? registerErrors.taxNumber : ''} />
              <Input label={t('auth.password') as string} name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('password')} error={registerTouched.password ? registerErrors.password : ''} />
              <div className="md:col-span-2">
                <Input label={t('auth.confirmPassword') as string} name="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={handleRegisterChange} onBlur={() => handleRegisterBlur('confirmPassword')} error={registerTouched.confirmPassword ? registerErrors.confirmPassword : ''} />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full rounded-full bg-[#f27128] px-6 py-3.5 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
                  {t('auth.submitRegister') as string}
                </button>
                <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-[#f27128]">
                  {t('auth.switchToLogin') as string}
                </Link>
              </div>
            </form>
          )}

          {error && <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
          {message && <p className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-medium text-[#f27128]">{message}</p>}
        </section>
      </div>
    </main>
  );
}

function Input({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      <span className="mb-2 block">{label}</span>
      <input
        {...props}
        required
        aria-invalid={Boolean(error)}
        className={`w-full rounded-full border bg-[#fffaf6] px-4 py-3 text-sm outline-none transition ${error ? 'border-red-300 focus:border-red-400' : 'border-orange-100 focus:border-orange-300'}`}
      />
      {error && <span className="mt-2 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? 'text-emerald-600' : 'text-slate-500'}`}>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">
        {ok ? '✓' : '•'}
      </span>
      <span>{text}</span>
    </li>
  );
}
