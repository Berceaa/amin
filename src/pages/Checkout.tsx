import { useMemo, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import PawTrail from '../components/PawTrail';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import {
  normalizeSpaces,
  validateEmail,
  validateNotes,
  validatePersonName,
  validatePhone,
  validatePickupStore,
  type CheckoutField,
  type ValidationErrors,
} from '../utils/validation';

function parsePrice(value: string) {
  const normalized = value.replace(',', '.').match(/[\d.]+/);
  return normalized ? Number(normalized[0]) : 0;
}

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupStore: string;
  pickupPerson: string;
  notes: string;
  pickupSlot: string;
  payment: string;
};

export default function CheckoutPage() {
  const { t } = useI18n();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [errors, setErrors] = useState<ValidationErrors<CheckoutField>>({});
  const [form, setForm] = useState<CheckoutForm>({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    pickupStore: 'Pawsentials Bucharest',
    pickupPerson: user?.name || '',
    notes: '',
    pickupSlot: '12:00 - 15:00',
    payment: 'card',
  });

  const pickupFee = 0;
  const tax = subtotal * 0.19;
  const total = subtotal + pickupFee + tax;

  const itemSummary = useMemo(
    () => items.map((item) => ({ ...item, lineTotal: parsePrice(item.price) * item.quantity })),
    [items],
  );

  const validationMessages = useMemo(() => ({
    nameRequired: t('validation.nameRequired') as string,
    nameInvalid: t('validation.nameInvalid') as string,
    emailRequired: t('validation.emailRequired') as string,
    emailInvalid: t('validation.emailInvalid') as string,
    phoneRequired: t('validation.phoneRequired') as string,
    phoneInvalid: t('validation.phoneInvalid') as string,
    pickupStoreRequired: t('validation.pickupStoreRequired') as string,
    pickupStoreInvalid: t('validation.pickupStoreInvalid') as string,
    notesTooLong: t('validation.notesTooLong') as string,
  }), [t]);

  const validateField = (field: CheckoutField, currentForm: CheckoutForm) => {
    switch (field) {
      case 'firstName':
        return validatePersonName(currentForm.firstName, validationMessages.nameRequired, validationMessages.nameInvalid);
      case 'lastName':
        return validatePersonName(currentForm.lastName, validationMessages.nameRequired, validationMessages.nameInvalid);
      case 'email':
        return validateEmail(currentForm.email, validationMessages.emailRequired, validationMessages.emailInvalid);
      case 'phone':
        return validatePhone(currentForm.phone, validationMessages.phoneRequired, validationMessages.phoneInvalid);
      case 'pickupStore':
        return validatePickupStore(currentForm.pickupStore, validationMessages.pickupStoreRequired, validationMessages.pickupStoreInvalid);
      case 'pickupPerson':
        return validatePersonName(currentForm.pickupPerson, validationMessages.nameRequired, validationMessages.nameInvalid, 3);
      case 'notes':
        return validateNotes(currentForm.notes, validationMessages.notesTooLong);
      default:
        return '';
    }
  };

  const validateForm = (currentForm: CheckoutForm) => {
    const fields: CheckoutField[] = ['firstName', 'lastName', 'email', 'phone', 'pickupStore', 'pickupPerson', 'notes'];
    return fields.reduce<ValidationErrors<CheckoutField>>((acc, field) => {
      const fieldError = validateField(field, currentForm);
      if (fieldError) acc[field] = fieldError;
      return acc;
    }, {});
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => {
      const nextForm = { ...current, [name]: value };
      if (touched[name as CheckoutField]) {
        setErrors(validateForm(nextForm));
      }
      return nextForm;
    });
  };

  const handleBlur = (field: CheckoutField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateForm(form));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    const nextErrors = validateForm(form);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      pickupStore: true,
      pickupPerson: true,
      notes: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError(t('validation.fixFormErrors') as string);
      return;
    }

    setForm((current) => ({
      ...current,
      firstName: normalizeSpaces(current.firstName),
      lastName: normalizeSpaces(current.lastName),
      email: current.email.trim(),
      phone: current.phone.trim(),
      pickupStore: normalizeSpaces(current.pickupStore),
      pickupPerson: normalizeSpaces(current.pickupPerson),
      notes: current.notes.trim(),
    }));

    setOrderPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm md:p-12"><div className="mb-6 flex justify-center"><PawTrail size="sm" /></div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">🔐</div>
          <h1 className="mt-6 text-4xl font-black text-slate-900">{t('auth.loginTitle') as string}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t('auth.loginDesc') as string}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
              {t('nav.login') as string}
            </Link>
            <Link to="/register" className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800">
              {t('nav.register') as string}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm md:p-12"><div className="mb-6 flex justify-center"><PawTrail size="sm" /></div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">✓</div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Pawsentials</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">{t('checkout.successTitle') as string}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{t('checkout.successText') as string}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/products" className="rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
              {t('checkout.continueShopping') as string}
            </Link>
            <Link to="/contact" className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800">
              {t('nav.contact') as string}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm md:p-12"><div className="mb-6 flex justify-center"><PawTrail size="sm" /></div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">🛒</div>
          <h1 className="mt-6 text-4xl font-black text-slate-900">{t('checkout.emptyTitle') as string}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{t('checkout.emptyText') as string}</p>
          <Link to="/products" className="mt-8 inline-flex rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
            {t('checkout.continueShopping') as string}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <section className="relative overflow-hidden premium-panel rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm"><PawTrail className="mb-5" size="sm" />
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Checkout</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">{t('checkout.title') as string}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t('checkout.desc') as string}</p>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-8">
          <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">01</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('checkout.customerTitle') as string}</h2>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#f27128]">{t('checkout.secure') as string}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label={t('checkout.firstName') as string} name="firstName" value={form.firstName} onChange={handleChange} onBlur={() => handleBlur('firstName')} error={touched.firstName ? errors.firstName : ''} />
              <Input label={t('checkout.lastName') as string} name="lastName" value={form.lastName} onChange={handleChange} onBlur={() => handleBlur('lastName')} error={touched.lastName ? errors.lastName : ''} />
              <Input label={t('checkout.email') as string} name="email" type="email" value={form.email} onChange={handleChange} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : ''} />
              <Input label={t('checkout.phone') as string} name="phone" value={form.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} error={touched.phone ? errors.phone : ''} />
              <Input label={t('checkout.pickupStore') as string} name="pickupStore" value={form.pickupStore} onChange={handleChange} onBlur={() => handleBlur('pickupStore')} error={touched.pickupStore ? errors.pickupStore : ''} />
              <Input label={t('checkout.pickupPerson') as string} name="pickupPerson" value={form.pickupPerson} onChange={handleChange} onBlur={() => handleBlur('pickupPerson')} error={touched.pickupPerson ? errors.pickupPerson : ''} />
            </div>

            <TextArea
              label={t('checkout.notes') as string}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              onBlur={() => handleBlur('notes')}
              rows={4}
              error={touched.notes ? errors.notes : ''}
              helper={`${form.notes.trim().length}/240`}
              placeholder={t('checkout.notesPlaceholder') as string}
            />
          </section>

          <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">02</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">{t('checkout.deliveryTitle') as string}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <OptionCard
                title={t('checkout.pickupOnlyOption') as string}
                description={t('checkout.pickupOnlyText') as string}
                checked
                onSelect={() => undefined}
              />
              <OptionCard
                title={t('checkout.pickupTimeTitle') as string}
                description={`${t('checkout.pickupTimeText') as string} • ${form.pickupSlot}`}
                checked
                onSelect={() => setForm((current) => ({ ...current, pickupSlot: current.pickupSlot === '12:00 - 15:00' ? '15:00 - 18:00' : '12:00 - 15:00' }))}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">03</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">{t('checkout.paymentTitle') as string}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <OptionCard
                title={t('checkout.cardOption') as string}
                description={t('checkout.cardText') as string}
                checked={form.payment === 'card'}
                onSelect={() => setForm((current) => ({ ...current, payment: 'card' }))}
              />
              <OptionCard
                title={t('checkout.cashOption') as string}
                description={t('checkout.cashText') as string}
                checked={form.payment === 'cash'}
                onSelect={() => setForm((current) => ({ ...current, payment: 'cash' }))}
              />
              <OptionCard
                title={t('checkout.transferOption') as string}
                description={t('checkout.transferText') as string}
                checked={form.payment === 'transfer'}
                onSelect={() => setForm((current) => ({ ...current, payment: 'transfer' }))}
              />
            </div>
          </section>
        </form>

        <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8 xl:sticky xl:top-28">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Order</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{t('checkout.summaryTitle') as string}</h2>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#f27128]">
              {items.length} {items.length === 1 ? t('checkout.item') as string : t('checkout.items') as string}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {itemSummary.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-[1.5rem] border border-orange-100 bg-[#fffaf6] p-4">
                <img src={item.image} alt={item.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f27128]">{item.tag}</p>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{t('checkout.qty') as string}: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-slate-900">{item.lineTotal.toFixed(2)} lei</p>
              </article>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-orange-100 pt-6 text-sm">
            <PriceRow label={t('cart.subtotal') as string} value={`${subtotal.toFixed(2)} lei`} />
            <PriceRow label={t('checkout.tax') as string} value={`${tax.toFixed(2)} lei`} />
            <PriceRow label={t('checkout.pickup') as string} value={t('checkout.free') as string} />
            <div className="flex items-center justify-between border-t border-orange-100 pt-4 text-base font-black text-slate-900">
              <span>{t('checkout.total') as string}</span>
              <span className="text-2xl text-[#f27128]">{total.toFixed(2)} lei</span>
            </div>
          </div>

          {submitError && <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{submitError}</p>}

          <button type="submit" form="checkout-form" className="paw-button mt-6 w-full rounded-full bg-[#f27128] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(242,113,40,0.28)]">
            {t('checkout.placeOrder') as string}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">{t('checkout.disclaimer') as string}</p>
        </aside>
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

function TextArea({ label, error, helper, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; helper?: string }) {
  return (
    <label className="mt-4 block text-sm font-semibold text-slate-800">
      <span className="mb-2 block">{label}</span>
      <textarea
        {...props}
        className={`w-full rounded-[1.5rem] border bg-[#fffaf6] px-4 py-3 text-sm outline-none transition ${error ? 'border-red-300 focus:border-red-400' : 'border-orange-100 focus:border-orange-300'}`}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        {error ? <span className="block text-xs font-medium text-red-600">{error}</span> : <span />}
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
      </div>
    </label>
  );
}

function OptionCard({
  title,
  description,
  checked,
  onSelect,
}: {
  title: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-[1.5rem] border p-5 text-left transition ${checked ? 'border-[#f27128] bg-[#fff7f1]' : 'border-orange-100 bg-white hover:border-orange-200'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className={`mt-1 inline-flex h-5 w-5 rounded-full border ${checked ? 'border-[#f27128] bg-[#f27128]' : 'border-orange-200'}`} />
      </div>
    </button>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
