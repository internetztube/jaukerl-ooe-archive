const dayjs = require('dayjs')

// https://gist.github.com/miguelmota/7905510
const getDates = function (startDate, endDate) {
    let dates = [],
        currentDate = startDate,
        addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

const finishedDays = () => {
    const result = getDates(new Date(2021, 6 - 1, 15), new Date())
        .map((date) => {
            date = dayjs(date)
            return {year: date.format('YYYY'), month: date.format('MM'), day: date.format('DD')}
        })
    result.pop()
    return result;
}

module.exports = finishedDays