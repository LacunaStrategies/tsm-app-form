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
        async jwt({ token, account, profile}) {
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
        async session({ session, token }) {
            session['twitter'] = {
                twitterHandle: token.userProfile.twitterHandle
            }
            return session
        }
    }
}

export default NextAuth(authOptions)