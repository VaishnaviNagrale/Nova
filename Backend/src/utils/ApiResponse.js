// ApiResponse class to send response in a standard format
class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode<400
    }
}

export {ApiResponse}