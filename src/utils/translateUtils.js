/**
 * Translates text using Google Translate's free API endpoint.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'en', 'es', 'ja').
 * @param {string} sourceLang - The source language code (defaults to 'auto').
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
    if (!text || text.trim() === '') return text;

    const langMap = { 'id': 'id', 'en': 'en', 'es': 'es', 'fr': 'fr', 'ja': 'ja' };
    const tl = langMap[targetLang] || targetLang;
    const sl = sourceLang === 'auto' ? 'auto' : (langMap[sourceLang] || sourceLang);

    // Chunk text to avoid URL length limits (approx 1500 chars per chunk to be safe)
    const MAX_CHUNK_SIZE = 1500;
    const chunks = [];

    for (let i = 0; i < text.length; i += MAX_CHUNK_SIZE) {
        chunks.push(text.slice(i, i + MAX_CHUNK_SIZE));
    }

    try {
        const translatedChunks = await Promise.all(chunks.map(async (chunk) => {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data[0]) {
                return data[0].map(segment => segment[0]).join('');
            }
            return chunk;
        }));

        return translatedChunks.join('');
    } catch (error) {
        console.error(`Translation error (${sourceLang} -> ${targetLang}):`, error);
        return text;
    }
};
