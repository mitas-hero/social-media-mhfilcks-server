export const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))
    }
}
// i am using this because i don't want to repeat try...catch multiple time
// Here i didn't understand anything!!!