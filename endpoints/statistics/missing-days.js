require('dotenv').config()
const {Octokit} = require("@octokit/core");
const getFinishedDays = require('./finished-days')
const {exportFilePathGenerator} = require('./config')

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const token = process.env.GITHUB_TOKEN

const missingDays = async () => {
    const finishedDays = getFinishedDays()
    const octokit = new Octokit({auth: token});

    for (let i = 0; i < finishedDays.length; i++) {
        const {year, month, day} = finishedDays[i]
        const path = exportFilePathGenerator({year, month, day})
        try {
            const response = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}`, {owner, repo, path})
            delete finishedDays[i]
        } catch (e) {
            console.log(e.status)
        }
    }
    return finishedDays.filter(Boolean)
}

module.exports = missingDays