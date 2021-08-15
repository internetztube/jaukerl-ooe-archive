require('dotenv').config()
const {checkoutFolder, baseFolder} = require('./config')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const {execSync} = require('child_process')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER

const cmd = (command, cwd) => {
    execSync(command, {stdio: 'inherit', cwd});
}

const cloneRepo = async ({day, month, year}) => {
    const startDateTime = dayjs.utc(`${year}-${month}-${day}T00:00:00.000Z`)
    let current = startDateTime.clone()
    const urls = [];
    console.log({day, month, year})
    do {
        const fileName = `${current.format('YYYY-MM-DDTHH:mm:ssZ')}.json`
        const url = `https://raw.githubusercontent.com/internetztube/jaukerl-ooe-archive/master/data/${current.format('YYYY/MM/DD')}/${fileName}`
        urls.push({url, fileName})
        current = current.add(1, 'minute')
    } while(current.format('YYYY/MM/DD') === startDateTime.format('YYYY/MM/DD'))
    const dayFolder = `${checkoutFolder}/data/${year}/${month}/${day}`
    fs.ensureDirSync(dayFolder)

    const download = async ({url, fileName}) => {
        const responseData = await fetch(url)
        const response = await responseData.text()
        fs.writeFileSync(`${dayFolder}/${fileName}`, response)
    }

    const promises = urls.map(({url, fileName}) => download({url, fileName}))
    await Promise.all(promises)
}

module.exports = cloneRepo