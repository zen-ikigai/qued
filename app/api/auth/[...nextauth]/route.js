import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@/utils/database'
import { User } from '@/models/user'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      })

      session.user.id = sessionUser._id.toString()
      session.user.image = sessionUser.image
      session.user.username = sessionUser.username
      session.user.tasks = sessionUser.tasks
      return session
    },

    async signIn({ profile }) {
      try {
        await connectToDB()

        const userExists = await User.findOne({ email: profile.email })
        if (!userExists) {
          const name = profile.name.split(' ')
          const firstName = name[0] || '.'
          const lastName = name.slice(1).join(' ') || '.'
          const username = `${firstName}${lastName}`.replace(/\s/g, '')

          const response = await fetch(
            `${process.env.MICROSERVICE_URL}/get-image?clientId=${process.env.CLIENT_ID}&apiKey=${process.env.API_KEY}`,
          )
          const data = await response.json()
          const profileImage = data.image[0]

          await User.create({
            email: profile.email,
            username: username,
            image: profileImage,
          })
        }
        return true
      } catch (error) {
        console.log(error)
      }
      return false
    },
  },
})

export { handler as GET, handler as POST }
