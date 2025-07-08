const authorise=function (...roles) {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user is set by a previous middleware
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = authorise;