// @desc    Upload PDF document
// @route   POST /api/v1/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(()=> {});
        }
        next(error);
    }
}

// @desc    Get all user documents
// @route   GET /api/v1/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Get a single document with chunks
// @route   GET /api/v1/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Delete a document
// @route   DELETE /api/v1/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Update document title
// @route   PUT /api/v1/documents/:id
// @access  Private
export const updateDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}