const codeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const passwordCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
const otpCharacters = '0123456789';
const GenerateUtils = {
  string: (length: number, characters: string, prefix?: string) => {
    let result = prefix ?? '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  },
  code: (prefix: string, length: number = 12) => {
    return GenerateUtils.string(length, codeCharacters, prefix);
  },
  otp: (length: number = 6) => {
    return GenerateUtils.string(length, otpCharacters);
  },
  uuid: () => {
    return crypto.randomUUID();
  },
  password: (length: number = 12) => {
    return GenerateUtils.string(length, passwordCharacters);
  },
};
export default GenerateUtils;
