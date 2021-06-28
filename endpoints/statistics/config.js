module.exports = {
    baseFolder: `${__dirname}/`,
    checkoutFolder: `${__dirname}/checkout`,
    exportFilePathGenerator: ({year, month, day}) => {
        return `statistics-export/expired-appointments/${year}/${month}/${day}.json`
    }
}