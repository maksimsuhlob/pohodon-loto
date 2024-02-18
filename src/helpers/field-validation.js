const convertData = (data) => {
    const matrix = []
    Object.keys(data).forEach((key) => {
        const [i, j] = key.split('_')
        if (!matrix[Number(i)]) {
            matrix.push([])
        }
        matrix[Number(i)].push(data[`${i}_${j}`])
    })
    return matrix
}
const checkRows = (field, numbers) => {
    const rowNumbers = []
    field.forEach((row, idx) => {
        if (row.every(item => numbers.includes(Number(item)))) {
            rowNumbers.push(idx)
        }
    })
    return rowNumbers
}
const checkColumns = (field, numbers) => {
    const columnNumbers = []
    const columnAmount = field[0].length
    for (let column = 0; column < columnAmount; column++) {
        const columnItems = []
        field.forEach((row, idx) => {
            columnItems.push(row[column])
        })
        if (columnItems.every(item => numbers.includes(Number(item)))) {
            columnNumbers.push(column)
        }
    }

    return columnNumbers
}
const checkDiagonal = (field, numbers) => {
    const columnAmount = field[0].length
    const diagonal1Items = []
    const diagonal2Items = []
    for (let column = 0; column < columnAmount; column++) {
        diagonal1Items.push(field[column][column])
        diagonal2Items.push(field[columnAmount - 1 - column][column])
    }
    return [diagonal1Items, diagonal2Items].some(diagonal => diagonal.every(item => numbers.includes(Number(item))))
}
export const validateField = (members, numbers) => {
    if (!numbers || !members) return {
        row: [],
        column: [],
        diagonal: [],
        full: [],
    }
    const data = Object.entries(members)
    return data.reduce((acc, item) => {
        const [name, data] = item
        const field = convertData(data)
        const rowNumbers = checkRows(field, numbers)
        if (rowNumbers.length === field.length) {
            //full
            acc.full.push(name)
            // return acc
        }
        if (rowNumbers.length) {
            acc.row.push(name)
            // return acc
        }
        const columnNumbers = checkColumns(field, numbers)

        if (columnNumbers.length) {
            acc.column.push(name)
            // return acc
        }
        if (checkDiagonal(field, numbers)) {
            acc.diagonal.push(name)
        }
        return acc
    }, {
        row: [],
        column: [],
        diagonal: [],
        full: [],
    })
}
