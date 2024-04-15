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
      if (!session?.user?.email) return session

      const user = await User.findOne({ email: session.user.email }).lean()
      if (!user) return session

      session.user = {
        ...session.user,
        id: user._id.toString(),
        username: user.username,
        image: user.image,
        tasks: user.tasks,
      }
      return session
    },

    async signIn({ profile }) {
      try {
        await connectToDB()

        let user = await User.findOne({ email: profile.email }).lean()
        if (!user) {
          const name = profile.name.split(' ')
          const firstName = name[0] || '.'
          const lastName = name.slice(1).join(' ') || '.'
          const username = `${firstName}${lastName}`.replace(/\s/g, '')

          const response = await fetch(
            `${process.env.MICROSERVICE_URL}/get-image?clientId=${process.env.CLIENT_ID}&apiKey=${process.env.API_KEY}`,
          )
          const data = await response.json()
          const profileImage = data.image[0]
          const newUser = {
            email: profile.email,
            username: username,
            image: profileImage,
          }
          user = await new User(newUser).save()
        }
        return user != null
      } catch (error) {
        console.log(error)
      }
      return false
    },
  },
})

export { handler as GET, handler as POST }
