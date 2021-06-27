const checkoutFolder = `${__dirname}/checkout`;

module.exports = {
    checkoutFolder,
    exportFilePathGenerator: ({
                                  year,
                                  month,
                                  day
                              }) => `statistics-export/expired-appointments/${year}/${month}/${day}.json`
}