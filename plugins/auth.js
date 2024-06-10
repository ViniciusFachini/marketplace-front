export default defineNuxtPlugin(async (nuxtApp) => {
    const { session, refresh, update, reset, overwrite } = await useSession();
    return {
        provide: {
            loginUser: async (userData) => {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                }
                const runtimeConfig = useRuntimeConfig();
                let response = await fetch(`${runtimeConfig.public.serverUrl}/users/login`, config)
                response = await response.json()
                console.log(response)
                if (response.token) {
                    overwrite(response)
                }
            },
            registerUser: async (userData) => {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                }
                const runtimeConfig = useRuntimeConfig();
                let response = await fetch(`${runtimeConfig.public.serverUrl}/users/register`, config)
                response = await response.json()
                return response
            }
        }
    }
});