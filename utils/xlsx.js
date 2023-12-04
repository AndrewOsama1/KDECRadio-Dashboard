const XLSX = require('xlsx')

exports.jsonToExcel = json => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(json)
    const cellStyle = {
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        padding: {
            top: 5,
            bottom: 5,
            left: 10,
            right: 10
        }
    }
    Object.keys(worksheet).forEach(cell=> {
        if (cell !== '!ref')
            worksheet[cell].s = cellStyle
    })
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
    return XLSX.writeXLSX(workbook, { bookType: 'xlsx', type: "array" })
}
