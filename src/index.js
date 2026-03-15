const ones = {
    '0': 'нөл', '1': 'бір', '2': 'екі', '3': 'үш', '4': 'төрт',
    '5': 'бес', '6': 'алты', '7': 'жеті', '8': 'сегіз', '9': 'тоғыз'
};

const tens = {
    '10': 'он', '20': 'жиырма', '30': 'отыз', '40': 'қырық', '50': 'елу',
    '60': 'алпыс', '70': 'жетпіс', '80': 'сексен', '90': 'тоқсан'
};

const transcriptions = {
    'нөл': 'нёл',
    'бір': 'быр',
    'екі': 'е-кы',
    'үш': 'уш',
    'төрт': 'тёрт',
    'бес': 'бес',
    'алты': 'ал-ты',
    'жеті': 'же-ты',
    'сегіз': 'се-гыз',
    'тоғыз': 'то-гыз',
    'он': 'он',
    'жиырма': 'жы-йыр-ма',
    'отыз': 'о-тыз',
    'қырық': 'кы-рык',
    'елу': 'е-лю',
    'алпыс': 'ал-пыс',
    'жетпіс': 'жет-пыс',
    'сексен': 'сек-сен',
    'тоқсан': 'ток-сан',
    'жүз': 'жюз'
};

function getTranscription(text) {
    return text.split(' ').map(word => transcriptions[word] || word).join(' ');
}

function chunkToKazakh(chunk) {
    if (!chunk) return '';
    if (chunk.length === 1) return ones[chunk];

    if (chunk.length === 2) {
        if (chunk === '00') return 'нөл нөл';
        if (chunk[0] === '0') return 'нөл ' + ones[chunk[1]];
        if (chunk[1] === '0') return tens[chunk];
        return tens[chunk[0] + '0'] + ' ' + ones[chunk[1]];
    }

    if (chunk.length === 3) {
        if (chunk === '000') return 'нөл нөл нөл';
        const parts = [];
        if (chunk[0] !== '0') {
            parts.push(chunk[0] === '1' ? 'жүз' : ones[chunk[0]] + ' жүз');
        } else {
            parts.push('нөл');
        }
        if (chunk[1] !== '0') {
            parts.push(tens[chunk[1] + '0']);
            if (chunk[2] !== '0') parts.push(ones[chunk[2]]);
        } else {
            if (chunk[2] !== '0') {
                if (chunk[0] === '0') parts.push('нөл');
                parts.push(ones[chunk[2]]);
            }
        }
        return parts.join(' ');
    }
    if (chunk.length === 4) {
        return chunkToKazakh(chunk.slice(0, 2)) + ' ' + chunkToKazakh(chunk.slice(2, 4));
    }
    return '';
}

function getChunks(code) {
    if (!code) return [];
    if (code.length === 16) {
        return [code.slice(0, 4), code.slice(4, 8), code.slice(8, 12), code.slice(12, 16)];
    }
    if (code.length === 11 && /^[78]/.test(code)) {
        return [code.slice(0, 1), code.slice(1, 4), code.slice(4, 7), code.slice(7, 9), code.slice(9, 11)];
    }
    if (code.length === 10 && /^7/.test(code)) {
        return [code.slice(0, 3), code.slice(3, 6), code.slice(6, 8), code.slice(8, 10)];
    }
    const matches = code.match(/([1-9]00|\d{2}|\d)/g);
    return matches || [];
}

const inputEl = document.getElementById('code-input');
const clearBtn = document.getElementById('clear-btn');
const emptyState = document.getElementById('empty-state');
const tagsGrid = document.getElementById('tags-grid');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const transcriptionText = document.getElementById('transcription-text');
const copyBtn = document.getElementById('copy-btn');
const copyIcon = document.getElementById('copy-icon');
const copyTextEl = document.getElementById('copy-text');

const svgCopy = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const svgCheck = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

const copyBtnDefaultClass = 'copy-btn-base flex-shrink-0 w-full sm:w-auto bg-surface-card text-primary-800 border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 active:scale-[0.98] shadow-sm touch-manipulation';
const copyBtnSuccessClass = 'copy-btn-base flex-shrink-0 w-full sm:w-auto bg-primary-100 text-primary-800 border-2 border-primary-300 shadow-sm touch-manipulation';

let currentJoinedText = '';

function formatDisplayValue(raw) {
    if (!raw) return '';
    if (raw.length === 16) return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (raw.length === 11 && /^[78]/.test(raw)) return raw.replace(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');
    if (raw.length === 10 && raw[0] === '7') return raw.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
    return raw;
}

function render() {
    const rawVal = inputEl.value.replace(/\D/g, '');
    inputEl.value = formatDisplayValue(rawVal);

    if (rawVal.length > 0) {
        clearBtn.classList.remove('hidden');
        emptyState.classList.add('hidden');
        tagsGrid.classList.remove('hidden');
        tagsGrid.classList.add('flex');
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('flex');

        const chunks = getChunks(rawVal);

        tagsGrid.innerHTML = chunks.map((chunk) => {
            const kaz = chunkToKazakh(chunk);
            const trans = getTranscription(kaz);
            return `
                <div class="chunk-card">
                    <span class="text-lg sm:text-xl font-bold text-primary-800 font-mono tracking-wider">${chunk}</span>
                    <span class="text-xs sm:text-sm font-semibold text-primary-800 mt-1 text-center whitespace-nowrap leading-tight">${kaz}</span>
                    <span class="text-[10px] sm:text-xs text-primary-500/90 italic mt-0.5 text-center leading-tight">${trans}</span>
                </div>
            `;
        }).join('');

        currentJoinedText = chunks.map(chunkToKazakh).join(', ');
        const joinedTranscription = chunks.map(c => getTranscription(chunkToKazakh(c))).join(', ');

        resultText.textContent = currentJoinedText;
        transcriptionText.textContent = `[ ${joinedTranscription} ]`;

    } else {
        clearBtn.classList.add('hidden');
        emptyState.classList.remove('hidden');
        tagsGrid.classList.add('hidden');
        tagsGrid.classList.remove('flex');
        resultContainer.classList.add('hidden');
        resultContainer.classList.remove('flex');
        tagsGrid.innerHTML = '';
        currentJoinedText = '';
    }
    resetCopyButton();
}

function resetCopyButton() {
    copyBtn.className = copyBtnDefaultClass;
    copyIcon.innerHTML = svgCopy;
    copyTextEl.textContent = "Копировать";
}

inputEl.addEventListener('input', render);
clearBtn.addEventListener('click', () => { inputEl.value = ''; render(); inputEl.focus(); });
copyBtn.addEventListener('click', () => {
    if (!currentJoinedText) return;
    const textArea = document.createElement("textarea");
    textArea.value = currentJoinedText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copyBtn.className = copyBtnSuccessClass;
    copyIcon.innerHTML = svgCheck;
    copyTextEl.textContent = "Скопировано";
    setTimeout(resetCopyButton, 2000);
});
