// ffmpeg -i url -vframes 1 input.jpg
// -y: Overwrite output files without asking
// -i: URL

const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const Jimp = require('jimp')

const run = (url, onError, onSuccess, onDone) => {
    ffmpeg(url)
    .frames(1)
    .format('image2')
    .on('stderr', (stderrLine) => {
        console.log('Stderr output: ' + stderrLine)
    })
    .on('error', (err, stdout, stderr) => {
        console.log('Cannot process video: ' + err.message)
        onError(err)
    })
    .on('end', () => {
        console.log('Processing finished !')
        onDone()
    })
    .pipe()
    .on('data', (chunk) => {
        console.log('ffmpeg just wrote ' + chunk.length + ' bytes')
        onSuccess(chunk)
    })
}

const runSync = (url) => {
    return new Promise((resolve, reject) => {
        let chunks = []
        run(url, (err) => {
            reject(err)
        }, (chunk) => {
            chunks.push(chunk)
        }, () => {
            Jimp.read(Buffer.concat(chunks)).then(jimp => resolve(jimp)).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    })
}

module.exports = runSync
