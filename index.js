const express = require('express')
const { Octokit } = require("@octokit/core");
const dayjs = require('dayjs')
const fetch = require('node-fetch')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3000
const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const token = process.env.GITHUB_TOKEN
const apiUrl = process.env.API_URL


app.get('/', async (req, res) => {
  const now = dayjs()
  const fileName = `${now.format()}.json`;
  const folderName = now.format('YYYY/mm/DD')

  const responseData = await fetch(apiUrl)
  const response = await responseData.text()
  const content = Buffer.from(response).toString('base64')

  const octokit = new Octokit({ auth: token });
  const path = `data/${folderName}/${fileName}`;
  const message = `Add ${fileName}.`
  const result = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {owner, repo, path, message, content})
  console.log(`fetch done: ${fileName}`)

  res.json({success: true, url: result.data.content._links.html })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
