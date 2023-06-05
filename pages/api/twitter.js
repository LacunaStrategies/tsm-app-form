// ** Twitter Import
import Twitter from 'twitter-lite'
const twitterClient = new Twitter({
    consumer_key: process.env.LACUNADEVBOT_TWITTER_API_KEY,
    consumer_secret: process.env.LACUNADEVBOT_TWITTER_API_SECRET,
    access_token_key: process.env.LACUNADEVBOT_TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.LACUNADEVBOT_TWITTER_ACCESS_SECRET
})

export default async function handler(req, res) {
    // Trigger Twitter notification to Admins
    const parameters = {
        screen_name: 'lacunastrats'
    }

    try {
        const resp = await twitterClient.get('followers/ids', parameters)
        // console.log(resp)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error})
    }

    res.status(200).json({ success: true })
}