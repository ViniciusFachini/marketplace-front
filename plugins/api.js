import { defineNuxtPlugin } from '#app';

const validateToken = async () => {
    const { session } = await useSession();
    const dateString = session.value.createdAt
    let dateObject = new Date(dateString)
    dateObject.setHours(dateObject.getHours() + session.value.expiresIn / 3600)
    const dateNow = new Date()
    const isTokenValid = !dateObject < dateNow;
    // console.log('Expiração: ', dateObject)
    // console.log('Agora: ', dateNow)
    // console.log('Maior: ', dateObject > dateNow ? dateObject : dateNow)
    return isTokenValid
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const { session } = await useSession();
    const router = useRouter()
    return {
        provide: {
            validateToken: async () => {
                const dateString = session.value.createdAt
                let dateObject = new Date(dateString)
                dateObject.setHours(dateObject.getHours() + session.value.expiresIn / 3600)
                const dateNow = new Date()
                const isTokenValid = !dateObject < dateNow;
                // console.log('Expiração: ', dateObject)
                // console.log('Agora: ', dateNow)
                // console.log('Maior: ', dateObject > dateNow ? dateObject : dateNow)
                return isTokenValid
            },
            isAdmin: async () => {
                if (session.value.token && session.value.token.length > 1) {
                    const valid = await validateToken();
                    const userRole = session.value.user.role.toLowerCase()
                    if (valid && userRole == 'admin') {
                        return true
                    }
                    return false
                }
                return false
            },
            fetchInfoAuthenticated: async (endpoint, method = 'get', reqBody = null) => {
                const token = session.value.token && validateToken()
                if (token) {
                    const config = {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${session.value.token}`
                        },
                        body: reqBody ? JSON.stringify(reqBody) : null
                    }
                    try {
                        const runtimeConfig = useRuntimeConfig();
                        const response = await fetch(`${runtimeConfig.public.serverUrl}/${endpoint}`, config);

                        if (response.ok) {
                            const jsonData = await response.json();
                            return jsonData;
                        } else {
                            console.error(`Request failed with status: ${response.status} - ${response.statusText}`)
                            return response
                        }
                    } catch (error) {
                        console.error('Fetch error:', error.message);
                        throw error;
                    } finally {
                    }
                }
            },
            isAuthenticated: async () => {
                try {
                    if (session.value.token && session.value.token.length > 1) {
                        const valid = await validateToken();
                        if (valid) {
                            return true;
                        }
                    }
                } catch (error) {
                    console.error("Error occurred while checking authentication status:", error);
                }
                return false; // Explicitly return false if token is invalid or missing
            },
            fetchInfo: async (endpoint, method = 'get') => {
                const config = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                try {
                    const runtimeConfig = useRuntimeConfig();
                    const response = await fetch(`${runtimeConfig.public.serverUrl}/${endpoint}`, config);
                    if (response.ok) {
                        const jsonData = await response.json();
                        return jsonData;
                    } else {
                        console.error(`Request failed with status: ${response.status} - ${response.statusText}`)
                    }
                } catch (error) {
                    console.error('Fetch error:', error.message);
                    throw error;
                }
            }
        }
    }
})