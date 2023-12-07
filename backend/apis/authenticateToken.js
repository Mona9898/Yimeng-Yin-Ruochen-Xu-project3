const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (token == null) {
        return res.sendStatus(401); // if there's no token
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // if the token does not match
        }
        
        req.user = user;
        next(); // proceed in the middleware chain
    });
};

module.exports = authenticateToken;
