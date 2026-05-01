import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

type Section = { title: string; text: string };

export function HowToPurchasePage() {
  const { t } = useI18n();
  const steps = t('infoPages.purchase.steps') as string[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <section className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Pawsentials</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">{t('infoPages.purchase.title') as string}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t('infoPages.purchase.intro') as string}</p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">{t('infoPages.purchase.stepsTitle') as string}</h2>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl bg-[#fffaf6] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f27128] font-black text-white">{index + 1}</span>
                <p className="pt-2 text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] bg-[#f27128] p-8 text-white shadow-[0_24px_50px_rgba(242,113,40,0.24)]">
          <h2 className="text-2xl font-black">{t('infoPages.purchase.noteTitle') as string}</h2>
          <p className="mt-4 leading-7 text-orange-50">{t('infoPages.purchase.noteText') as string}</p>
          <Link to="/products" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-[#f27128]">
            {t('nav.shopNow') as string}
          </Link>
        </aside>
      </section>
    </main>
  );
}

export function TransportDeliveryPage() {
  const { t } = useI18n();
  const sections = t('infoPages.delivery.sections') as Section[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <section className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27128]">Pickup only</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">{t('infoPages.delivery.title') as string}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t('infoPages.delivery.intro') as string}</p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {sections.map((section, index) => (
          <article key={section.title} className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">{['🏪', '⏱️', '💸', '✅'][index] ?? '📦'}</div>
            <h2 className="mt-5 text-xl font-black text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export function ContactUsPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-[#f27128] p-8 text-white shadow-[0_25px_60px_rgba(242,113,40,0.3)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">Pawsentials</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">{t('infoPages.contact.title') as string}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-orange-50">{t('infoPages.contact.intro') as string}</p>

          <div className="mt-10 space-y-4 text-sm">
            <Info label={t('infoPages.contact.email') as string} value="contact@pawsentials.ro" />
            <Info label={t('infoPages.contact.phone') as string} value="+40 741 000 111" />
            <Info label={t('infoPages.contact.address') as string} value="Str. Pawsentials 12, Bucharest" />
            <Info label={t('infoPages.contact.hours') as string} value={t('infoPages.contact.hoursText') as string} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">{t('infoPages.contact.formTitle') as string}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('infoPages.contact.responseText') as string}</p>
          <form className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              {t('contactPage.name') as string}
              <input className="rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 outline-none focus:border-orange-300" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              {t('contactPage.email') as string}
              <input className="rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 outline-none focus:border-orange-300" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              {t('contactPage.subject') as string}
              <input className="rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 outline-none focus:border-orange-300" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              {t('contactPage.message') as string}
              <textarea rows={6} className="rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 outline-none focus:border-orange-300" />
            </label>
            <button type="submit" className="rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white">
              {t('contactPage.send') as string}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/12 p-4">
      <p className="font-bold">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
