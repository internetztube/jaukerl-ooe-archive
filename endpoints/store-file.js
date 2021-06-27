require('dotenv').config()
const {Octokit} = require("@octokit/core");

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const token = process.env.GITHUB_TOKEN

const storeFile = async (path, content) => {
    const octokit = new Octokit({auth: token});
    const message = `Add ${path}`
    content = Buffer.from(content).toString('base64')
    return await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {owner, repo, path, message, content})
}

module.exports = storeFile