import NextAuth from 'next-auth'
import TwitterLegacy from 'next-auth/providers/twitter'

export const authOptions = {
    providers: [
        TwitterLegacy({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0",
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (profile) {
                token['userProfile'] = {
                    twitterHandle: profile.data.username,
                    twitterId: profile.data.id,
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
                twitterHandle: token.userProfile.twitterHandle,
                twitterId: token.userProfile.twitterId,
            }

            return session
        }
    }
}

export default NextAuth(authOptions)