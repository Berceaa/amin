import { useI18n, type Language } from '../context/I18nContext';

const languages: { value: Language; label: string; flag: string; name: string }[] = [
  { value: 'ro', label: 'RO', flag: '🇷🇴', name: 'Română' },
  { value: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { value: 'pl', label: 'PL', flag: '🇵🇱', name: 'Polski' },
  { value: 'zh', label: '中文', flag: '🇨🇳', name: '中文' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-white p-1 shadow-sm">
      {languages.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setLanguage(item.value)}
          title={item.name}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
            language === item.value
              ? 'bg-[#f27128] text-white shadow-sm'
              : 'text-slate-600 hover:bg-orange-50'
          }`}
        >
          <span className="text-sm leading-none">{item.flag}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
