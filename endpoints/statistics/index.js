require('dotenv').config()
const {Octokit} = require("@octokit/core");

const cloneRepo = require('./clone-repo')
const getMissingDays = require('./missing-days')
const expiredByDay = require('./expired-by-day');
const storeFile = require('../store-file')
const {exportFilePathGenerator} = require('./config')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const index = async (req, res) => {

    const missingDays = await getMissingDays()
    console.log({missingDays})
    const urls = []
    for (let i = 0; i < missingDays.length; i++) {
        console.log(missingDays[i])
        cloneRepo(missingDays[i]);
        const data = expiredByDay(missingDays[i])
        console.log(data)
        const result = await storeFile(exportFilePathGenerator(missingDays[i]), JSON.stringify(data))
        urls.push(result.data.content._links.html)
        break;
    }
    res.json({success: true, urls})
}

module.exports = index