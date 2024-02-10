export default class CustomError {
    static generateError({status = 500, name = "Unknown Error", message, cause = "Unknown Error", code = 1}){
        const error = new Error(message);
        error.status = status;
        error.name = name;
        error.code = code;
        error.cause = cause;
        
        throw error;
    }
}