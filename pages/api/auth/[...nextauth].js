import NextAuth from 'next-auth'
import TwitterLegacy from 'next-auth/providers/twitter'

export const authOptions = {
    providers: [
        TwitterLegacy({
            clientId: process.env.STAGE_TWITTER_CLIENT_KEY,
            clientSecret: process.env.STAGE_TWITTER_CLIENT_SECRET,
            version: "2.0",
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            // console.log('User:', user)
            // console.log('Account:', account)
            // console.log('Profile:', profile)
            // console.log('isNewuser:', isNewUser)
            // console.log('Token:', token)
            if (profile) {
                token['userProfile'] = {
                    twitterHandle: profile.data.username
                }
            }
            if (account) {
                token['credentials'] = {
                    authToken: account.access_token
                }
            }
            return token
        },
        async session({ session, user, token }) {
            // console.log('User:', user)
            // console.log('Token:', token)
            // console.log('Session:', session)
            session['twitter'] = {
                twitterHandle: token.userProfile.twitterHandle
            }
            return session
        }
    }
}

export default NextAuth(authOptions)