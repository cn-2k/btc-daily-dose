export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // Se o usuário estiver tentando acessar login ou register enquanto já está logado
  if (loggedIn.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }

  // Se o usuário estiver tentando acessar uma rota protegida sem estar logado
  if (!loggedIn.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }
})
