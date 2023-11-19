export interface Translation extends Record<string, string> {
    id: string;
    key: string;
}

export interface LanguageTranslations {
    languageCode: string;
    translations: Translation[];
}