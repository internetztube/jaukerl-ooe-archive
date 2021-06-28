require('dotenv').config()
const {Octokit} = require("@octokit/core");
const {manifestPath} = require('./config')
const storeFile = require('../store-file')
const fetch = require('node-fetch')

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const token = process.env.GITHUB_TOKEN

const addToManifest = async (filePath) => {
    const octokit = new Octokit({auth: token});
    let content;
    try {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${manifestPath}`
        content = await (await fetch(url)).json();
    } catch (e) {
        content = []
        console.log(e.status)
    }
    content.push({
        path: filePath,
    })

    await storeFile(manifestPath, JSON.stringify(content))
}

module.exports = addToManifest