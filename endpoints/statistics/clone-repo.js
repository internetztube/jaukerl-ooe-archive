const {checkoutFolder} = require('./config')
const fs = require('fs-extra')
const {execSync} = require('child_process')

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER

const cmd = (command, cwd) => {
    execSync(command, {stdio: 'inherit', cwd});
}

const cloneRepo = () => {
    fs.removeSync(checkoutFolder);
    cmd(`git clone git@github.com:${owner}/${repo}.git ${checkoutFolder}`)
}

module.exports = cloneRepo