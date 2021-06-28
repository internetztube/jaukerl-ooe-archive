require('dotenv').config()
const {checkoutFolder, baseFolder} = require('./config')
const fs = require('fs-extra')
const {execSync} = require('child_process')

const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER

const cmd = (command, cwd) => {
    execSync(command, {stdio: 'inherit', cwd});
}

const cloneRepo = ({day, month, year}) => {
    console.log({day, month, year})
    const branch = 'master'
    const tmpFileName = `tmp.zip`;
    fs.removeSync(checkoutFolder);
    fs.removeSync(`${baseFolder}/${tmpFileName}`);
    cmd(`wget https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip -O ${tmpFileName} --no-check-certificate`, baseFolder)
    cmd(`rm -rf ${repo}-${branch}`, baseFolder)
    cmd(`mkdir -p ${checkoutFolder}`)
    cmd(`unzip ${tmpFileName} "${repo}-${branch}/data/${year}/${month}/${day}/*" `, baseFolder)
    cmd(`mv ${repo}-${branch}/* ${checkoutFolder}`, baseFolder)
    cmd(`rm -rf ${repo}-${branch}`, baseFolder)
}

module.exports = cloneRepo