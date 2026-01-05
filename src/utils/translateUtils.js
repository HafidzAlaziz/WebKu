/**
 * Translates text using Google Translate's free API endpoint.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'en', 'es', 'ja').
 * @param {string} sourceLang - The source language code (defaults to 'auto').
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
    if (!text || text.trim() === '') return text;

    // Normalize language codes for Google Translate
    const langMap = {
        'id': 'id',
        'en': 'en',
        'es': 'es',
        'fr': 'fr',
        'ja': 'ja'
    };

    const tl = langMap[targetLang] || targetLang;
    const sl = sourceLang === 'auto' ? 'auto' : (langMap[sourceLang] || sourceLang);

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Google Translate returns an array of segments. We need to join them all.
        if (data && data[0]) {
            return data[0].map(segment => segment[0]).join('');
        }

        return text;
    } catch (error) {
        console.error(`Translation error (${sourceLang} -> ${targetLang}):`, error);
        return text; // Fallback to original text on error
    }
};
