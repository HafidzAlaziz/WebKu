export const EXCHANGE_RATES = {
    'id': { rate: 1, currency: 'IDR', locale: 'id-ID' },
    'en': { rate: 15500, currency: 'USD', locale: 'en-US' },
    'ja': { rate: 105, currency: 'JPY', locale: 'ja-JP' },
    'es': { rate: 16800, currency: 'EUR', locale: 'es-ES' },
    'fr': { rate: 16800, currency: 'EUR', locale: 'fr-FR' }
};

export const getCurrencyConfig = (lang) => EXCHANGE_RATES[lang] || EXCHANGE_RATES['en'];

export const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    // Remove "IDR", "Rp", dots, commas, and spaces
    const cleaned = priceStr.toString().replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
};

export const formatCurrency = (valueIdr, lang, t, allowZero = false) => {
    if (valueIdr === 'discussion' || (!allowZero && valueIdr === 0)) {
        return t('pricing.labels.negotiation');
    }

    const config = getCurrencyConfig(lang);
    const converted = valueIdr / config.rate;

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: config.currency === 'JPY' ? 0 : 0
    }).format(converted);
};
