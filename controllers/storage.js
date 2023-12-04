exports.uploadFile = async(req, res) => {
    try {
        if (req.file)
            res.status(201).json({ results: { url: req.file.location }})
        else
            res.status(404).json({ message: apiMessage("storage.fileNotFound", req.language) })
    } catch (error) {
        res.status(500).json({ message: apiMessage("server.internalError", req.language) })
    }
}
