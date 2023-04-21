module.exports = async (server, host, port, db, dbURI) => {
    const result = await db
        .connect(dbURI, {
            serverSelectionTimeoutMS: 5000
        })
        .catch(err => {
            console.log(err.message)
            process.exit(1)
        })

    console.log('MongoDB connected')

    server.listen(port, host, () => {
        console.log('Server is running')
    })

    process.on('uncaughtException', (err) => {
        console.log(err.message)
        process.exit(1)
    })
}


