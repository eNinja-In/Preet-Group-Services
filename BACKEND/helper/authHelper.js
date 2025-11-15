import bcrypt from 'bcrypt';
import color from 'colors';

export const hashPassword = async (password) => {
    try {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) { console.log(`Error In Hashing Encrypting : ${error}`.red); }
}


export const comparePassword = (password, hashedPassword) => {
    try { return bcrypt.compare(password, hashedPassword); }
    catch (err) { console.log(`Error in comparing Password : ${err}`.red); }
}