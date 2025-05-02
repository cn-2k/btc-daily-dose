import type { User } from '#auth-utils'

export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const { email, password } = await readBody(event)
  const user = await storage.getItem<User & { password?: string }>(email)
  if (!user) {
    return createError({
      statusCode: 400,
      statusMessage: 'Please check your email and password.',
    })
  }

  const isPasswordValid = await verifyPassword(user?.password || '', password)

  if (!isPasswordValid) {
    return createError({
      statusCode: 400,
      statusMessage: 'Please check your email and password.',
    })
  }

  delete user.password
  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  })

  return await getUserSession(event)
})
