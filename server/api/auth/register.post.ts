export default defineEventHandler(async (event) => {
  // Clear the current user session
  await clearUserSession(event)

  const storage = useStorage('data')

  // get email, password, name from the post body
  const body = await readBody(event)
  const { email, password, name } = body
  // check if email already exists in storage
  const existingUser = await storage.getItem(email)
  if (existingUser) {
    return createError({
      statusCode: 400,
      statusMessage: 'User already exists',
    })
  }

  const user = {
    name,
    email,
    createdAt: new Date(),
  }

  // if it doesn't, create a new user
  await storage.setItem(email, {
    ...user,
    // make sure to has the password for security!
    // never store plain text passwords!
    password: await hashPassword(password),
  })

  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  })

  return {
    email,
    password,
  }
})
