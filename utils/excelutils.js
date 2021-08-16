const ExcelJS = require("exceljs");
const { Readable } = require("stream");
const dateFormat = require("dateformat");
async function getExcelData(file) {
    const dataStream = Readable.from(file.data);
    const wb = new ExcelJS.Workbook();
    const extension = file.name.match(/\.[a-z]{3,5}/)
    if (extension) {
        switch (`${extension}`) {
            case ".xlsx":
                await wb.xlsx.read(dataStream);
                break;
            case ".csv":
                await wb.csv.read(dataStream);
                break;
        }
        const sheet = wb.getWorksheet(1);
        const rowsTotal = sheet.rowCount;
        const table = sheet.getRows(1, rowsTotal).map(row => row._cells.map(convertCellData));
        return formatTableData(table);
    }
    return null;
}
function formatTableData(tableRows) {
    const cols = tableRows.slice(0, 1)[0];
    const rows = tableRows.slice(1).map(row => {
        let ob = {};
        let kvps = row.map((rv, index) => {
            return {
                [cols[index]]: rv
            }
        })
        for (let kvp of kvps) {
            ob = { ...ob, ...kvp };
        }
        return ob;
    });
    return rows;
}
function convertCellData(cell) {
    const DATE_FORMAT = "dd/mm/yyyy";
    switch (cell._value.type) {
        case ExcelJS.ValueType.Date:
            return dateFormat(new Date(cell._value), DATE_FORMAT);
        default:
            return `${cell._value}`;
    }
}
exports.getExcelData = getExcelData;