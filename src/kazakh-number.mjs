const ones = {
  '0': 'нөл',
  '1': 'бір',
  '2': 'екі',
  '3': 'үш',
  '4': 'төрт',
  '5': 'бес',
  '6': 'алты',
  '7': 'жеті',
  '8': 'сегіз',
  '9': 'тоғыз',
};

const tens = {
  '10': 'он',
  '20': 'жиырма',
  '30': 'отыз',
  '40': 'қырық',
  '50': 'елу',
  '60': 'алпыс',
  '70': 'жетпіс',
  '80': 'сексен',
  '90': 'тоқсан',
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
  'жүз': 'жюз',
};

export function getTranscription(text) {
  return text.split(' ').map(word => transcriptions[word] || word).join(' ');
}

export function chunkToKazakh(chunk) {
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

export function getChunks(code) {
  if (!code) return [];
  if (code.length === 16) {
    return [code.slice(0, 4), code.slice(4, 8), code.slice(8, 12), code.slice(12, 16)];
  }
  if (code.length === 11 && /^[78]/.test(code)) {
    return [
      code.slice(0, 1),
      code.slice(1, 4),
      code.slice(4, 7),
      code.slice(7, 9),
      code.slice(9, 11),
    ];
  }
  if (code.length === 10 && /^7/.test(code)) {
    return [code.slice(0, 3), code.slice(3, 6), code.slice(6, 8), code.slice(8, 10)];
  }
  if (code.length === 4) {
    return [code.slice(0, 2), code.slice(2, 4)];
  }
  const matches = code.match(/([1-9]00|\d{2}|\d)/g);
  return matches || [];
}
