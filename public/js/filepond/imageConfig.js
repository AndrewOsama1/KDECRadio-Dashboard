FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
)

const inputElement = document.querySelector('.filepond')
const pond = FilePond.create(inputElement, {
    labelIdle: 'Drop your image or <span class="filepond--label-action">Browse</span>',
    labelFileWaitingForSize: 'Calculating size...',
    labelFileProcessing: 'Uploading...',
    labelFileProcessingComplete: 'Upload complete',
    labelFileProcessingAborted: 'Upload canceled',
    labelFileProcessingError: 'Error during upload',
    labelFileProcessingRevertError: 'Error during revert',
    labelFileLoadError: 'Error during loading',
    labelFileLoadTooSmall: 'File is too small',
    labelFileLoadTooLarge: 'File is too large',
    labelFileLoadInvalidFile: 'Invalid file type',
    labelFileLoadImageDimensions: 'Invalid image dimensions',
    labelFileLoadImageTooSmall: 'Image is too small',
    labelFileLoadImageTooLarge: 'Image is too large',
    labelFileRemoveError: 'Error while removing',
    labelFileRemove: 'Remove',
    labelFileClear: 'Clear',
    labelFileRetry: 'Retry',
    labelFileUndo: 'Undo',
    labelFileLoad: 'Loading...',
    labelFileCountSingular: 'file in the list',
    labelFileCountPlural: 'files in the list',
    acceptedFileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
    labelMaxFileSizeExceeded: "Maximum file size is 2MB",
    maxFileSize: '2MB'
})

pond.on('addfile', (error, file) => {
    if (!error)
        document.querySelector('.filepond--browser').name = 'imageCover'
})
