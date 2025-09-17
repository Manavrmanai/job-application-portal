const multer = require('multer');

const errorHandler = (error, req, res, next) => {
    console.error('Error occurred:', error);
    
    // Handle Multer-specific errors
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size allowed is 5MB.',
                error: 'FILE_TOO_LARGE'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Unexpected file field. Use "resume" as field name.',
                error: 'UNEXPECTED_FILE'
            });
        }
        return res.status(400).json({
            message: 'File upload error: ' + error.message,
            error: 'UPLOAD_ERROR'
        });
    }
    
    // Handle file type validation errors
    if (error.message === 'Only PDF, DOC, and DOCX files are allowed') {
        return res.status(400).json({
            message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.',
            error: 'INVALID_FILE_TYPE'
        });
    }
    
    // Generic server error
    res.status(500).json({
        message: 'Internal server error occurred.',
        error: 'SERVER_ERROR'
    });
};

module.exports = errorHandler;