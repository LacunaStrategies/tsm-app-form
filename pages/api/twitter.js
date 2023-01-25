// ** Twitter Import
import Twitter from 'twitter-lite'

export default async function handler(req, res) {

    // Request Variables
    const { method } = req

    switch (method) {
        case 'POST':

            const client = new Twitter({
                consumer_key: process.env.LSDEVLABSAPP_TWITTER_API_KEY,
                consumer_secret: process.env.LSDEVLABSAPP_TWITTER_API_SECRET,
                access_token_key: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.LSDEVLABSBOT_TWITTER_ACCESS_TOKEN_SECRET
            })

            const parameters = {
                event: {
                    type: "message_create",
                    message_create: {
                        target: {
                            recipient_id: '1509533708927205379'
                        },
                        message_data: {
                            text: "Somehow..."
                        }
                    }
                }
            }
            
            try {
                const resp = await client.post('direct_messages/events/new', parameters)
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