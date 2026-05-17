import { useEffect, useRef, useState } from 'react';
import { useI18n, type Language } from '../context/I18nContext';

const flagUrls: Record<Language, string> = {
  ro: 'https://flagcdn.com/ro.svg',
  en: 'https://flagcdn.com/gb.svg',
  pl: 'https://flagcdn.com/pl.svg',
  zh: 'https://flagcdn.com/cn.svg',
};

const languages: { value: Language; label: string }[] = [
  { value: 'ro', label: 'Română' },
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'zh', label: '中文' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedLanguage = languages.find((item) => item.value === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 min-w-[128px] items-center justify-between gap-2 rounded-full border border-white/30 bg-white px-4 text-sm font-bold text-[#f27128] shadow-sm transition hover:bg-orange-50"
        aria-label="Select language"
      >
        <span className="flex items-center gap-2">
          <img
            src={flagUrls[selectedLanguage.value]}
            alt=""
            className="h-4 w-6 rounded-[3px] object-cover shadow-sm"
          />
          <span>{selectedLanguage.label}</span>
        </span>

        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[10000] w-44 overflow-hidden rounded-2xl border border-orange-100 bg-white py-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          {languages.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setLanguage(item.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition ${
                language === item.value
                  ? 'bg-orange-50 text-[#f27128]'
                  : 'text-slate-700 hover:bg-orange-50 hover:text-[#f27128]'
              }`}
            >
              <img
                src={flagUrls[item.value]}
                alt=""
                className="h-4 w-6 rounded-[3px] object-cover shadow-sm"
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}