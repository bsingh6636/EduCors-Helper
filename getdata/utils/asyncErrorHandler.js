
export const asyncErrorHandler =(TheFunction) =>{
    return (req,res,next) =>{
       
        Promise.resolve(TheFunction(req,res,next)).catch(next);
    }
}