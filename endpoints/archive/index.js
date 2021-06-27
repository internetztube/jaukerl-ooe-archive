require('dotenv').config()
const {Octokit} = require("@octokit/core");
const dayjs = require('dayjs')
const fetch = require('node-fetch')

const port = process.env.PORT || 3000
const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const token = process.env.GITHUB_TOKEN
const apiUrl = process.env.API_URL

const index = async (req, res) => {
    const now = dayjs()
    const fileName = `${now.format()}.json`;
    const folderName = now.format('YYYY/MM/DD')

    const responseData = await fetch(apiUrl)
    const response = await responseData.text()
    const content = Buffer.from(response).toString('base64')

    const octokit = new Octokit({auth: token});
    const path = `data/${folderName}/${fileName}`;
    const message = `Add ${fileName}.`
    const result = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
        owner,
        repo,
        path,
        message,
        content
    })
    console.log(`fetch done: ${fileName}`)

    res.json({success: true, url: result.data.content._links.html})
}

module.exports = index