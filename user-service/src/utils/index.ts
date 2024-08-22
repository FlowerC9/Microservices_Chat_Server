import bcrypt from "bcryptjs";

class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(
        statusCode: number,
        message: string | undefined,
        isOperational = true,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const encryptPassword = async (password: string) => {
    const salt=await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password,salt);
    return encryptedPassword;
};

const isPasswordMatch = async (password: string, userPassword: string) => {
    const result = await bcrypt.compare(password, userPassword);
    return result;
};

export { ApiError, encryptPassword, isPasswordMatch };