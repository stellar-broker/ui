const size = 64

/**
 * @param {File} file
 * @return {Promise<string>}
 */
export async function resizeImage(file) {
    if (!file)
        return null
    const url = await getFileDataUrl(file)
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            try {
                const {width, height, x, y} = getShrunkenSize(image)

                const canvas = document.createElement('canvas')
                canvas.width = size
                canvas.height = size

                const ctx = canvas.getContext('2d')
                if (ctx == null)
                    throw new Error('Failed to obtain canvas context')
                ctx.imageSmoothingQuality = 'high'

                ctx.drawImage(
                    image,
                    0,
                    0,
                    image.width,
                    image.height,
                    x,
                    y,
                    width,
                    height
                )

                const dataUrl = canvas.toDataURL('image/webp')
                resolve(dataUrl)
            } catch (e) {
                reject(e)
            }
        }
        image.onerror = reject
        image.src = url
    })

}

function getShrunkenSize(image) {
    let res = {
        x: 0,
        y: 0
    }
    if (image.width > image.height) {
        res.width = size
        res.height = Math.round(size * image.height / image.width)
        res.y = (size - res.height) / 2
    } else {
        res.width = Math.round(size * image.width / image.height)
        res.height = size
        res.x = (size - res.width) / 2
    }
    return res
}

/**
 * @param {File} file
 * @return {Promise<string>}
 */
function getFileDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
        setTimeout(() => reject('Failed to load file'), 1000)
    })
}