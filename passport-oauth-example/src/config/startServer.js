const PORT = process.env.PORT
const HOST = process.env.HOST
const DB_URI = process.env.DB_URI

module.exports = (httpApp, dbDriver) => {
    dbDriver
        .connect(DB_URI, {})
        .then(() => {
            console.log("Connected to DB")
            httpApp.listen(PORT, HOST, () => {
                console.log(`Server is running on http://${HOST}:${PORT}`)
            })
            // TODO: add httpsApp
        })

    process.on('uncaughtException', async (err) => {
        console.log(err)
        dbDriver.disconnect()
        process.exit(1)
    })
}
