export default class CustomError {
    static CustomError({message = "Unknown Error", cause="Unknown Error", name="Exception"}){
        const error = new Error()
        error.message= message
        error.cause= cause
        error.name= name
        
        throw error
    }
}