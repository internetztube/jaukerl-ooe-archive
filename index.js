const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const archiveEndpoint = require('./endpoints/archive/index')
const statisticsEndpoint = require('./endpoints/statistics/index')
app.get('/', archiveEndpoint)

app.get('/statistics', statisticsEndpoint)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
