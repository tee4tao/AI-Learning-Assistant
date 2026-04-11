const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statuscode = 404;
        }
        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message)
            error.statuscode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message)
            error.statuscode = 400;
        }

        // Multer file size error
        if (err.code === 'LIMIT_FILE_SIZE') {
            const message = 'File size exceeded the limit of 10MB';
            error = new Error(message);
            error.statuscode = 400;
        }

        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid token';
            error = new Error(message);
            error.statuscode = 401;
        }

        if (err.name === 'TokenExpiredError') {
            const message = 'Token expired';
            error = new Error(message);
            error.statuscode = 401;
        }


        res.status(error.statuscode || 500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;