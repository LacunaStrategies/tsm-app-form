// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

import Twitter from 'twitter-lite'

export default async function submit(req, res) {
  const { method } = req

  const client = await clientPromise
  const db = client.db('sports')

  switch (method) {
    case 'POST':

      // Verify active sesion before proceeding
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session)
        return res.status(401).json({ message: 'Twitter connection is required to authenticate your application!' })

      // Variables
      const body = req.body;
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
      const findApplication = await db.collection('applications').findOne({ twitter: body.twitter })

      if (findApplication)
        return res.status(400).json({ message: `Application already exists for ${body.twitter}` })

      // Subit new application
      const newApplication = await db.collection('applications').insertOne({ ...body, status: 'Pending', profilePic: session.user.image })
      
      // Trigger Twitter notification to Admins
      const t = new Twitter({
        consumer_key: process.env.LSDEVLABSAPP_TWITTER_API_KEY,
        consumer_secret: process.env.LSDEVLABSAPP_TWITTER_API_SECRET,
        access_token_key: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN_SECRET
      })

      const parameters = {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: '1509533708927205379'
            },
            message_data: {
              text: `New Application Received from @${body.twitter}! Head to your /admin/applications page and approve/reject it now!`
            }
          }
        }
      }

      try {
        const resp = await t.post('direct_messages/events/new', parameters)
        console.log(resp)
      } catch (err) {
        console.log(err)
      }

      res.status(200).json({ ok: true })
      break;

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}