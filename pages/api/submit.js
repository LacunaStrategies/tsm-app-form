// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

// ** Twitter Lite Import
import Twitter from 'twitter-lite'
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

// ** Sendgrid Mail Import
import sendgrid from '@sendgrid/mail'
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export default async function submit(req, res) {
  const { method } = req

  const client = await clientPromise
  const db = client.db('sports')

  switch (method) {
    case 'POST':

      const errors = []

      // Verify active sesion before proceeding
      const session = await getServerSession(req, res, authOptions)
      if (!session)
        return res.status(401).json({ message: 'Twitter connection is required to authenticate your application!' })

      // Variables
      const body = req.body
      const requiredFields = ['wallet', 'twitter', 'q0,', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6']

      let failedValidation = false
      let invalidFields = 'The following fields are required: '

      // Validation Handler
      for (const [key, value] of Object.entries(body)) {
        if (requiredFields.indexOf(key) > -1 && value === '') {
          failedValidation = true
          invalidFields += `${key}, `
        }
      }

      // If validation fails, return validation message
      if (failedValidation)
        return res.status(400).json({ failedValidation: true, message: invalidFields })

      // Prevent duplicate entries
      const findApplication = await db.collection('applications').findOne({ twitter: body.twitterId })

      if (findApplication)
        return res.status(400).json({ message: `Application already exists for ${body.twitter} [id: ${body.twitterId}]` })

      // Subit new application
      await db.collection('applications').insertOne({ ...body, status: 'Pending', profilePic: session.user.image.replace('normal','400x400') })

      //// Trigger Twitter DM Notification to Admins
      // const parameters = {
      //   event: {
      //     type: 'message_create',
      //     message_create: {
      //       target: {
      //         recipient_id: '' // Enter Twitter ID
      //       },
      //       message_data: {
      //         text: `New Application Received from @${body.twitter}! Head to your /admin/applications page and approve/reject it now!`
      //       }
      //     }
      //   }
      // }

      // try {
      //   const resp = await twitterClient.post('direct_messages/events/new', parameters)
      // } catch (err) {
      //   console.log('Error Sending Direct Message via Twitter API => ', err)
      //   errors.push(err)
      // }

      // Trigger Email Notification
      try {
        await sendgrid.send({
          to: 'thesportsmetaverse@gmail.com',
          from: 'thescoutlist@gmail.com',
          subject: `[Application Received from The Sports Metaverse]: @${body.twitter}`,
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Application Received Notification</title>
            <meta name="description" content="Application Received Notification">
            <meta name="author" content="Lacuna Strategies">
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
          </head>
          
          <body>
            <div class="container" style="margin-left: 20px;margin-right: 20px;">
              <h3>You've received a new Application from @${body.twitter}</h3>
              <div style="font-size: 16px;">
                <p>Log in to the Admin section of your website and approve or deny the application!</p>
              </div>
            </div>
          </body>
          </html>`,
        })
      } catch (err) {
        console.log(err)
        errors.push(err)
      }

      res.status(errors.length > 0 ? 207 : 200).json({ success: true, errors, errorCount: errors.length })

      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}