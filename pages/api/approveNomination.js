import path from 'path'

// ** MongoDB Import
import clientPromise from '/lib/mongodb'
import { ObjectId } from "mongodb"

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

// ** Twitter Import
import Twitter from 'twitter-lite'
const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

const uploadClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
    subdomain: 'upload'
})

// // ** Canvas Imports
// const { createCanvas, loadImage, registerFont } = require('canvas')

export default async function handler(req, res) {
    const { method } = req
    const { nominationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    switch (method) {
        case 'PUT':

            // Verify active sesion before proceeding
            const session = await getServerSession(req, res, authOptions)
            if (!session)
                return res.status(401).json({ message: 'Twitter connection is required to authenticate your application!' })

            // Fetch nominee data from DB
            const nominee = await db.collection('members').findOne({ _id: ObjectId(nominationId) })
            if (!nominee || nominee?.status === 'approved' || nominee?.status === 'accepted')
                return res.status(400).json({ message: 'Nominee not found or has already been approved/accepted!' })

            // Fetch nominator data from DB
            const nominator = await db.collection('members').findOne({ twitterHandle: nominee.nominatedBy })

            // Fetch nominee data from Twitter API
            let nomineeTwitterUserData = {}
            try {
                nomineeTwitterUserData = await twitterClient.get('users/show', {
                    screen_name: nominee.twitterHandle
                })
            } catch (error) {
                console.error(error)
            }

            const nomineeProfilePic = nomineeTwitterUserData.profile_image_url_https
            const nomineeFollowerCount = nomineeTwitterUserData.followers_count
            const nomineeTwitterId = nomineeTwitterUserData.id_str

            // Approve nomination
            const approvednomination = await db.collection('members').updateOne(
                { _id: ObjectId(nominationId) },
                {
                    $set:
                    {
                        status: "approved",
                        followers: nomineeFollowerCount,
                        twitterId: nomineeTwitterId,
                        profilePic: nomineeProfilePic,
                    }
                }
            )

            // Verify update completed succesfully
            if (!approvednomination.modifiedCount)
                return res.status(400).json({ message: 'There was an issue updating the record!' })


            /* ==== Create Twitter Media ==== */
            // // Register Font
            // const fontFile = path.join(process.cwd(), 'fonts', 'Roboto-Bold.ttf')
            // registerFont(fontFile, { family: 'Roboto' })

            // // Canvas Size
            // const width = 1200
            // const height = 675

            // // Initiate canvas
            // const canvas = createCanvas(width, height)
            // const context = canvas.getContext('2d')

            // // Load background image
            // try {
            //     // Load image from assets and draw to canvas context as layer
            //     const imageToLoad = nominee.role === 'Member' ? 'public/assets/images/member-bg-1200x675.jpg' : 'public/assets/images/senior-bg-1200x675.jpg'
            //     const bgImage = await loadImage(imageToLoad)
            //     context.drawImage(bgImage, 0, 0, width, height)
            // } catch (error) {
            //     // If we encounter an error, log the error and apply a flat color background as fallback
            //     console.log('Error Loading Bg Image => ', error)
            //     context.fillStyle = '#000'
            //     context.fillRect(0, 0, width, height)
            // }

            // // Load nominator profile image
            // try {
            //     // Load image from assets and draw to canvas context as layer
            //     context.save()
            //     const profileImg = await loadImage(nominator.profilePic.replace('normal', '400x400'))
            //     context.beginPath()
            //     context.lineWidth = 20
            //     context.strokeStyle = '#ffca13'
            //     context.arc(338, 319, 143, 0, Math.PI * 2, false)
            //     context.stroke()
            //     context.clip()
            //     context.drawImage(profileImg, 195, 176, 286, 286)
            //     context.restore()
            // } catch (error) {
            //     // If we encounter an error, log the error and apply a flat color background as fallback
            //     console.log('Error Loading Nominator Profile Image => ', error)
            // }

            // // Load nominee profile image
            // try {
            //     // Load image from assets and draw to canvas context as layer
            //     context.save()
            //     const profileImg = await loadImage(nomineeProfilePic.replace('normal', '400x400'))
            //     context.beginPath()
            //     context.lineWidth = 20
            //     context.strokeStyle = '#ffca13'
            //     context.arc(862, 319, 143, 0, Math.PI * 2, false)
            //     context.stroke()
            //     context.clip()
            //     context.drawImage(profileImg, 719, 176, 286, 286)
            //     context.restore()
            // } catch (error) {
            //     // If we encounter an error, log the error and apply a flat color background as fallback
            //     console.log('Error Loading Nominee Profile Image => ', error)
            // }

            // // Set image text placeholders values
            // let text = ''

            // // Set text to Nominator Twitter handle
            // text = `@${nominator.twitterHandle}`

            // // Set base text/font styles
            // context.textAlign = 'center'
            // context.font = '42px "Roboto"'

            // // Fill bottom drop shadow
            // context.fillStyle = 'rgba(0,0,0,0.3)'
            // context.fillText(text, 342, 529)

            // // Fill top drop shadow
            // context.fillStyle = 'rgba(0,0,0,0.7)'
            // context.fillText(text, 340, 526)

            // // Fill text
            // context.fillStyle = '#fff'
            // context.fillText(text, 338, 524)

            // // Set text to Nominee Twitter handle
            // text = `@${nominee.twitterHandle}`

            // // Set base text/font styles
            // context.textAlign = 'center'

            // // Fill bottom drop shadow
            // context.fillStyle = 'rgba(0,0,0,0.3)'
            // context.fillText(text, 866, 529)

            // // Fill top drop shadow
            // context.fillStyle = 'rgba(0,0,0,0.7)'
            // context.fillText(text, 864, 526)

            // // Fill text
            // context.fillStyle = '#fff'
            // context.fillText(text, 862, 524)

            // const dataUrl = canvas.toDataURL()
            // const base64 = dataUrl.split(',')[1]

            // // const buffer = canvas.toBuffer('image/png')
            // // writeFileSync('generatedImages/test.png', buffer)

            // let mediaIdString = ''
            // try {
            //     const { media_id_string } = await uploadClient.post('media/upload', {
            //         media_data: base64,
            //         media_category: 'TWEET_IMAGE',
            //     })
            //     mediaIdString = media_id_string
            // } catch (error) {
            //     console.log('Media Upload to Twitter Failed => ', error)
            // }

            // const parameters = {
            //     media_ids: mediaIdString,
            //     status: `Congratulations, @${nominee.twitterHandle}! You have been nominated by ${nominee.role === 'Member' ? 'Senior Scout' : 'Elite Scout'} @${nominee.nominatedBy} to be a ${nominee.role} on their team! Head on over to our website to accept your nomination${nominee.role === "Senior Scout" ? ' and start building your team' : ''}!`
            // }

            // try {
            //     const tweet = await twitterClient.post('statuses/update', parameters)
            // } catch (error) {
            //     console.log('Error Posting Tweet! => ', error)
            //     return res.status(500).json({ success: false, error })
            // }

            res.status(200).json({ success: true })
            break

        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}