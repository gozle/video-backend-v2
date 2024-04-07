export const generateStrongKey = (length) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = lowercase.toUpperCase();
  const digits = '0123456789';
  const symbols = '_-';
  const allChars = lowercase + uppercase + digits + symbols;

  let key = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    key += allChars.charAt(randomIndex);
  }

  return key;
};
