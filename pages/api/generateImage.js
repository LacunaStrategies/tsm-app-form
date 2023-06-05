const fs = require('fs')
const { createCanvas, loadImage, registerFont } = require('canvas')

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':

            registerFont('public/assets/fonts/lulo-clean-one-bold.ttf', { family: 'Lulo One' })
            const width = 1600
            const height = 900

            const canvas = createCanvas(width, height)
            const context = canvas.getContext('2d')

            // Apply background
            try {
                // Load Background Image
                const bgImage = await loadImage('public/assets/images/sports-stadium-1600x900.jpg')
                // Draw Background Image Layer
                context.drawImage(bgImage, 0, 0, width, height)
            } catch (error) {
                // Log the error
                console.log('Error Loading Bg Image => ', error)
                // Apply fallback of flat color background
                context.fillStyle = '#000'
                context.fillRect(0, 0, width, height)
            }

            // Apply Logo
            try {
                // Load Logo Image
                const logoImg = await loadImage('public/assets/images/thesportsmetaverse-logo.png')
                // Draw Logo Image Layer
                context.drawImage(logoImg, width - 250, 100, 150, 133)
            } catch (error) {
                // Log the error
                console.log('Error Loading Logo Image => ', error)
            }

            let text = ''
            let textMeasurements = 0
            
            text = '@TwitterHndl'
            textMeasurements = context.measureText(text)

            context.textAlign = 'right'
            context.fillStyle = '#000'
            context.font = '82px "Comic Sans"'
            context.fillText(text, width - 97, 453)

            context.fillStyle = '#fff'
            context.font = '82px "Comic Sans"'
            context.fillText(text, width - 100, 450)

            text = 'Welcome Elite Scout'
            textMeasurements = context.measureText(text)

            context.fillStyle = '#000'
            context.font = '82px "Comic Sans"'
            context.fillText(text, width - 97, 563)

            context.fillStyle = '#fff'
            context.font = '82px "Comic Sans"'
            context.fillText(text, width - 100, 560)


            // const dataUrl = canvas.toDataURL()

            const buffer = canvas.toBuffer('image/png')
            fs.writeFileSync('generatedImages/test.png', buffer)

            res.status(200).json({ success: true })
            break

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}   