const { scrypt } = require('node:crypto')
const { promisify } = require('node:util')

const scryptAsync = promisify(scrypt)

// const = N, blockSize = r
const scryptOpts = { 
    cost: 16384, 
    blockSize: 8 
}

module.exports = async function (password, salt) {
    return new Promise(async (resolve, reject) => {
        const hash = await scryptAsync(password, salt, 64, scryptOpts)
            .catch(err => reject(err))
        resolve(hash)
    })
}