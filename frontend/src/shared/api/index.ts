const BASE_URL = 'http://localhost:5050/api'

async function apiRequest(path: string, options: any = {}) {
    const token = localStorage.getItem('auth_token')
    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', 'application/json')
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    const config: RequestInit = {
        ...options,
        headers,
    }
    if (options.body) {
        config.body = JSON.stringify(options.body)
    }
    const response = await fetch(`${BASE_URL}${path}`, config)
    const data = await response.json()
    if (!response.ok) {
        throw { response: { data } }
    }
    return { data }
}

const api = {
    get: (path: string) => apiRequest(path, { method: 'GET' }),
    post: (path: string, body: any) => apiRequest(path, { method: 'POST', body }),
    put: (path: string, body: any) => apiRequest(path, { method: 'PUT', body }),
    delete: (path: string) => apiRequest(path, { method: 'DELETE' }),
}

export default api