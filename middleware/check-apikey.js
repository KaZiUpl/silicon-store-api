// middleware for checking api key validity
module.exports = (req, res, next) => {
    if(req.headers.authorization != 'Bearer test')
    {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    next();
}