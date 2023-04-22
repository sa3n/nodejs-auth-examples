const { generateKeyPair } = require('node:crypto')
const { writeFile } = require('node:fs/promises')
const path = require('path');

(() => {
    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            format: 'pem',
            type: 'pkcs1'
        }
    }, async (err, publicKey, privateKey) => {
        await writeFile(path.join(__dirname, 'rsaPublicKey.pem'), publicKey)
        await writeFile(path.join(__dirname, 'rsaPrivateKey.pem'), privateKey)
    }) 
})()