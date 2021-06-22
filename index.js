const baseOld = './base_old.jpg'
const base = './base.jpg'
const input = './input.jpg'
const output = './output.jpg'

const fs = require('fs')
const Jimp = require('jimp')
const img = require('./img_handler.js')
const rtsp = require('./rtsp_handler.js')

require('dotenv').config()

const run = async (baseImage, url) => {
    if (!baseImage || !url) {
        console.log('Require params: $baseImage: ByteArray, $url: String')
        return null
    }
    
    const jimpInput = await rtsp(url)

    const jimpBase = await Jimp.read(baseImage)

    const result = await img(jimpBase, jimpInput)
    
    const diffs = result.diffs
    console.log('Diff length: ' + result.diffs)
    
    const buffer = await result.jimp.getBufferAsync(Jimp.MIME_JPEG)
    console.log('Buffer length: ' + buffer.length)

    return {
        image: buffer,
        length: diffs,
    }
}

module.exports = run
