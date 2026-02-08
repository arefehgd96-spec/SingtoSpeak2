import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/components/TranslationProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher({ variant = 'default' }) {
  const { locale, changeLanguage } = useTranslation();

  if (variant === 'compact') {
    return (
      <Select value={locale} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-white">
          <Globe className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-white">
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {t('appLanguage')}
      </label>
      <Select value={locale} onValueChange={changeLanguage}>
        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-white">
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}