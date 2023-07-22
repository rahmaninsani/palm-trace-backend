const randomString = (stringLength, alphabet) => {
  const alphabetSize = alphabet.length;
  let result = '';

  for (let i = 0; i < stringLength; i++) {
    const char = alphabet[Math.floor(Math.random() * alphabetSize)];
    result += char;
  }

  return result;
};

const generateTransactionCode = (prefix) => {
  const stringLength = 10;
  const alphabet = '0123456789';
  const random = randomString(stringLength, alphabet);

  const currentTime = new Date();
  const transactionDate = currentTime.toISOString().slice(0, 10).replace(/-/g, '');

  const transactionCode = `${prefix}/${transactionDate}/${random}`;
  return transactionCode;
};

export default { generateTransactionCode };
