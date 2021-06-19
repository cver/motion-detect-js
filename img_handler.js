const fs = require('fs')
const Jimp = require('jimp')

const findDiff = async (gray1, gray2, minArea) => {
    const diff = new cv.Mat()
    cv.absdiff(gray1, gray2, diff)

    const thresh = new cv.Mat()
    cv.threshold(diff, thresh, 25, 255, cv.THRESH_BINARY)
    diff.delete()

    const dilate = new cv.Mat()
    const M = cv.Mat.ones(3, 3, cv.CV_8U)
    const anchor = new cv.Point(-1, -1)
    cv.dilate(thresh, dilate, M, anchor, 2)
    thresh.delete()

    const contours = new cv.MatVector()
    cv.findContours(dilate, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    dilate.delete()

    let result = []

    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i)
        if (cv.contourArea(cnt) > minArea) {
            const rect = cv.boundingRect(cnt)
            result.push(rect)
        }
    }

    contours.delete()
    return result
}

const run = async (jimpSrc1, jimpSrc2, minArea = 20) => {
    const src1 = cv.matFromImageData(jimpSrc1.bitmap)
    const gray1 = new cv.Mat()
    cv.cvtColor(src1, gray1, cv.COLOR_RGBA2GRAY)
    src1.delete()
    const blur1 = new cv.Mat()
    cv.GaussianBlur(gray1, blur1, new cv.Size(21, 21), 0)
    gray1.delete()
    
    const src2 = cv.matFromImageData(jimpSrc2.bitmap)
    let dst = src2.clone()
    const gray2 = new cv.Mat()
    cv.cvtColor(src2, gray2, cv.COLOR_RGBA2GRAY)
    src2.delete()
    const blur2 = new cv.Mat()
    cv.GaussianBlur(gray2, blur2, new cv.Size(21, 21), 0)
    gray2.delete()


    const diffs = await findDiff(blur1, blur2, minArea)
    blur1.delete()
    blur2.delete()

    diffs.forEach(element => {
        const point1 = new cv.Point(element.x, element.y)
        const point2 = new cv.Point(element.x + element.width, element.y + element.height)
        cv.rectangle(dst, point1, point2, [0, 0, 255, 255], 2)
    })

    const jimpDst = new Jimp({
        width: dst.cols,
        height: dst.rows,
        data: Buffer.from(dst.data)
    })

    dst.delete()

    return {
        jimp: jimpDst,
        diffs: diffs.length,
    }
}

// Module = {
//     onRuntimeInitialized: run
// }

cv = require('./opencv.js')

module.exports = run
