<script setup lang="ts">
const toast = useToast()

const { fetch } = useUserSession()

const handleRegister = async (form: {
  name: string
  email: string
  password: string
}) => {
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: form,
    })
    await fetch()

    navigateTo('/')
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusMessage' in error) {
      toast.add({
        color: 'error',
        title: 'Register failed',
        description: error.statusMessage as string,
      })
    }
    else {
      console.error(error)
    }
  }
}
</script>

<template>
  <RegisterForm @register="handleRegister" />
</template>
