// ** MongoDB Import
import clientPromise from '/lib/mongodb'

// ** NextAuth Imports
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

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
      const requiredFields = ['wallet', 'twitter', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6']

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
      const newApplication = await db.collection('applications').insertOne({ ...body, status: 'Pending' })
      console.log(newApplication)

      res.status(200).json({ ok: true })
      break;

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}