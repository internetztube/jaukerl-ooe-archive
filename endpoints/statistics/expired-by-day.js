require('dotenv').config()
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const {checkoutFolder} = require('./config')
dayjs.extend(utc)
dayjs.extend(timezone)

const path = require('path')
const fs = require('fs-extra')

const dataByDay = ({day, month, year}) => {
    const relativeFilePath = `data/${year}/${month}/${day}`
    const dayFolder = `${checkoutFolder}/${relativeFilePath}`;
    const fileMap = {};
    fs.readdirSync(dayFolder).forEach((fileName) => {
        const key = path.parse(fileName).name;
        const filePath = `${dayFolder}/${fileName}`
        let data = null
        try {
            data = require(filePath)
        } catch (e) {
            return;
        }
        if (!data || !data.data || !data.data.appointments) return
        fileMap[data.fetchedAt] = data.data.appointments.map((appointment) => {
            appointment.fetched_at = data.fetchedAt;
            appointment.filePath = `${relativeFilePath}/${fileName}`;
            appointment.uid = `${appointment.startDate}__${appointment.authority.id}__${appointment.category.id}`
            return appointment
        })
    })
    const result = []
    Object.values(fileMap).forEach(appointments => {
        appointments.forEach(appointment => result.push(appointment))
    })
    return result
}

const expiredAppointments = (appointments) => {
    return appointments.filter((appointment) => {
        const fetchedAt = dayjs.unix(appointment.fetched_at);
        const startedAt = dayjs.tz(appointment.startDate, "Europe/Vienna")
        const diff = startedAt.diff(fetchedAt, 'minute')
        const check = diff <= 2
        appointment._diff = diff
        appointment._fetchedDate = `${fetchedAt}`
        appointment._startDate = `${startedAt}`
        // console.log('filter', diff, `${fetchedAt}`)
        return check
    })
}

const uniqueAppointments = (appointments) => {
    const byUid = {};
    appointments.forEach((appointment) => {
        if (!byUid[appointment.uid]) byUid[appointment.uid] = []
        byUid[appointment.uid].push(appointment)
    })

    return Object.values(byUid).map((appointments) => {
        return appointments.sort((a1, a2) => {
            return dayjs(a2._fetchedDate).unix() - dayjs(a1._fetchedDate).unix()
        })[0]
    })
}

const expiredByDay = ({day, month, year}) => {
    let appointments = [];
    appointments = dataByDay({day, month, year});
    appointments = expiredAppointments(appointments)
    appointments = uniqueAppointments(appointments)
    let expiredSlots = 0;
    appointments.forEach(a => expiredSlots += a.freeSlots)
    return {expiredSlots, appointments}
}

module.exports = expiredByDay