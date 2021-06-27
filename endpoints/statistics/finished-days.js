const glob = require("glob");
const path = require("path");
const {checkoutFolder} = require('./config')

const finishedDays = () => {
    const dataFolder = `${checkoutFolder}/data/`
    let result = glob.sync(dataFolder + '/**/*').map((filePath) => {
        filePath = filePath.replace(dataFolder, '')
        filePath = path.parse(filePath).dir
        return filePath
    })
    result = [...new Set(result)]
    result = result.map((date) => {
        const {0: year, 1: month, 2: day} = date.split('/')
        if (year && month && day) return {year, month, day}
        return null
    }).filter(Boolean)

    result.pop()
    return result
}

module.exports = finishedDays