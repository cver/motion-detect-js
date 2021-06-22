const baseOld = './base_old.jpg'
const base = './base.jpg'
const input = './input.jpg'
const output = './output.jpg'

const fs = require('fs')
const Jimp = require('jimp')
const img = require('./img_handler.js')
const rtsp = require('./rtsp_handler.js')

require('dotenv').config()

const run = async () => {
    const args = require('minimist')(process.argv.slice(2), {
        string: ['url']
    })
    const url = args.url || process.env.URL
    if (!url) {
        console.log(args)
        console.log('"URL" is required')
        return
    }

    if (fs.existsSync(baseOld)) {
        fs.unlinkSync(baseOld)
    }
    if (fs.existsSync(base)) {
        fs.renameSync(base, baseOld)
    }
    if (fs.existsSync(input)) {
        fs.renameSync(input, base)
    }
    if (fs.existsSync(output)) {
        fs.unlinkSync(output)
    }
    
    const jimpInput = await rtsp(url, input)
    jimpInput.writeAsync(input)

    const jimpBase = await Jimp.read(base)

    const result = await img(jimpBase, jimpInput)
    console.log('Length: ' + result.diffs)
    result.jimp.writeAsync(output)
}

module.exports = run()
