// ffmpeg -i url -vframes 1 input.jpg
// -y: Overwrite output files without asking
// -i: URL

const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const Jimp = require('jimp')

const run = (url, name, onError, onSuccess, onDone) => {
    // const outStream = fs.createWriteStream(name)
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
    // .pipe(outStream, { end: true })
    .on('data', (chunk) => {
        console.log('ffmpeg just wrote ' + chunk.length + ' bytes')
        onSuccess(chunk)
    })
    // .save(name)
}

const runSync = (url, name) => {
    return new Promise((resolve, reject) => {
        let chunks = []
        run(url, name, (err) => {
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
