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

// ** Canvas Imports
// import { createCanvas, loadImage, registerFont } from 'canvas'

export default async function handler(req, res) {

    const { applicationId } = req.query

    const client = await clientPromise
    const db = client.db('sports')

    // Verify active sesion before proceeding
    const session = await getServerSession(req, res, authOptions)
    if (!session)
        return res.status(401).json({ message: 'Twitter connection is required to authenticate your application!' })

    // Get application data
    const application = await db.collection('applications').findOne({ _id: ObjectId(applicationId) })
    if (!application)
        return res.status(400).json({ message: 'Application not found!' })

    // Check for existing member
    const existingMember = await db.collection('scoutlist').findOne({ twitterId: application.twitterId })
    if (existingMember)
        return res.status(400).json({ message: 'This individual is already part of another team!' })

    let twitterFollowers
    try {
        // Query Twitter Followers
        twitterFollowers = await twitterClient.get('followers/ids', {
            screen_name: application.twitter
        })
    } catch (err) {
        console.log('Error Retrieving Followers => ', err)
    }

    // Create New Team
    const newTeam = await db.collection('teams').insertOne({
        name: application.twitter,
        logo: '',
        homeColor: '',
        awayColor: '',
        trophies: [],
        points: 0,
        wins: 0,
        losses: 0,
        createdOn: Date.now(),
    })

    // Add applicant to members collection as an Elite Scout
    await db.collection('scoutlist').insertOne({
        role: 'Elite Scout',
        twitterHandle: application.twitter,
        twitterId: application.twitterId,
        profilePic: application.profilePic,
        nominatedBy: 'Application',
        status: 'accepted',
        teamId: newTeam.insertedId,
        followers: twitterFollowers?.ids.length || 0,
    })

    // Approve application
    const approvedApplication = await db.collection('applications').updateOne(
        { _id: ObjectId(applicationId) },
        { $set: { status: "Approved" } }
    )

    // Verify update completed succesfully
    if (!approvedApplication.modifiedCount)
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
    //     const bgImageFile = path.join(process.cwd(), 'images', 'elite-bg-1200x675.jpg')
    //     // const bgImage = await loadImage('public/assets/images/elite-bg-1200x675.jpg')
    //     const bgImage = await loadImage(bgImageFile)
    //     context.drawImage(bgImage, 0, 0, width, height)
    // } catch (error) {
    //     // If we encounter an error, log the error and apply a flat color background as fallback
    //     console.log('Error Loading Bg Image => ', error)
    //     context.fillStyle = '#000'
    //     context.fillRect(0, 0, width, height)
    // }

    // context.save()
    // // Load profile image
    // try {
    //     // Load image from assets and draw to canvas context as layer
    //     const profileImg = await loadImage(application.profilePic)
    //     context.arc(244, 335, 153, 0, Math.PI * 2, false)
    //     context.lineWidth = 16
    //     context.strokeStyle = '#ffca13'
    //     context.stroke()
    //     context.clip()
    //     context.drawImage(profileImg, 91, 182, 306, 306)
    //     context.restore()
    // } catch (error) {
    //     // If we encounter an error, log the error and apply a flat color background as fallback
    //     console.log('Error Loading Bg Image => ', error)
    // }

    // // Set image text placeholders values
    // let text = ''

    // // Set text to Twitter handle
    // text = `@${application.twitter}`

    // // Set base text/font styles
    // context.textAlign = 'right'
    // context.font = '62px "Roboto"'

    // // Fill bottom drop shadow
    // context.fillStyle = 'rgba(0,0,0,0.3)'
    // context.fillText(text, width - 63, 333)

    // // Fill top drop shadow
    // context.fillStyle = 'rgba(0,0,0,0.7)'
    // context.fillText(text, width - 67, 326)

    // // Fill text
    // context.fillStyle = '#fec920'
    // context.fillText(text, width - 71, 319)

    // // Set text to welcome message part 3
    // text = 'Scout'

    // context.fillStyle = 'rgba(0,0,0,0.3)'
    // context.fillText(text, width - 63, 421)

    // context.fillStyle = 'rgba(0,0,0,0.7)'
    // context.fillText(text, width - 67, 414)

    // context.fillStyle = '#fff'
    // context.fillText(text, width - 71, 407)

    // // Set text to welcome message part 2
    // text = 'Elite'

    // context.fillStyle = 'rgba(0,0,0,0.3)'
    // context.fillText(text, width - 257, 421)

    // context.fillStyle = 'rgba(0,0,0,0.7)'
    // context.fillText(text, width - 261, 414)

    // context.fillStyle = '#fec920'
    // context.fillText(text, width - 265, 407)

    // // Set text to welcome message part 2
    // text = 'Welcome'

    // context.fillStyle = 'rgba(0,0,0,0.3)'
    // context.fillText(text, width - 416, 421)

    // context.fillStyle = 'rgba(0,0,0,0.7)'
    // context.fillText(text, width - 420, 414)

    // context.fillStyle = '#fff'
    // context.fillText(text, width - 424, 407)

    // const dataUrl = canvas.toDataURL()
    // const base64 = dataUrl.split(',')[1]

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

    // // Create Twitter Message
    // const parameters = {
    //     media_ids: mediaIdString,
    //     status: `Congratulations, @${application.twitter}! Your application has been accepted and you are now an Elite Scout! Head over to our website to start building your team!`
    // }

    // try {
    //     await twitterClient.post('statuses/update', parameters)
    // } catch (error) {
    //     console.log('Error Posting Tweet! => ', error)
    //     return res.status(500).json({ success: false, error })
    // }

    res.status(200).json({ success: true })

}