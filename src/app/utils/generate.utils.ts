const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const GenerateUtils = {
    code: (prefix: string, length: number = 12) => {
        let result = prefix;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    },
    otp: (length: number = 6) => {
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10); // Chỉ sinh số từ 0-9
        }
        return otp;
    }
}
export default GenerateUtils;
