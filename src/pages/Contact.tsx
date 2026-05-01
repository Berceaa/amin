import { useI18n } from '../context/I18nContext';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-[#f27128] p-8 text-white shadow-[0_25px_60px_rgba(242,113,40,0.3)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">Pawsentials</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">{t('contactPage.title') as string}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-orange-50">{t('contactPage.desc') as string}</p>

          <div className="mt-10 space-y-5 text-sm">
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="font-bold">Email</p>
              <p className="mt-1">contact@pawsentials.ro</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="font-bold">Phone</p>
              <p className="mt-1">+40 741 000 111</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="font-bold">Address</p>
              <p className="mt-1">Str. Pawsentials 12, Bucharest</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
          <form className="grid gap-5">
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
            <div className="flex flex-wrap gap-4">
              <button type="submit" className="rounded-full bg-[#f27128] px-6 py-3 font-semibold text-white">
                {t('contactPage.send') as string}
              </button>
              <button type="button" className="rounded-full border border-orange-200 px-6 py-3 font-semibold text-slate-800">
                {t('contactPage.visit') as string}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
