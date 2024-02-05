class apiError extends Error{
    constructor(
        statuscode,
        message="Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode,
        this.data = null,
        this.sucess = false,
        this.stack = stack,
        this.errors = errors

        if(stack){
           this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

}
export { apiError }