import { useI18n, type Language } from '../context/I18nContext';

const languages: { value: Language; flag: string; name: string }[] = [
  { value: 'ro', flag: '🇷🇴', name: 'Română' },
  { value: 'en', flag: '🇬🇧', name: 'English' },
  { value: 'pl', flag: '🇵🇱', name: 'Polski' },
  { value: 'zh', flag: '🇨🇳', name: '中文' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-white p-1 shadow-sm" aria-label="Language selector">
      {languages.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setLanguage(item.value)}
          title={item.name}
          aria-label={item.name}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
            language === item.value
              ? 'bg-[#f27128] text-white shadow-sm'
              : 'text-slate-600 hover:bg-orange-50'
          }`}
        >
          <span className="leading-none">{item.flag}</span>
        </button>
      ))}
    </div>
  );
}
