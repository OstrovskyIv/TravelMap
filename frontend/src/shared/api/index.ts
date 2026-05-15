const BASE_URL = 'http://localhost:5050/api'

async function apiRequest(path: string, options: any = {}) {
    const token = localStorage.getItem('auth_token')
    const headers = new Headers(options.headers || {})

    // Если мы отправляем НЕ FormData, то ставим заголовок JSON
    // Для FormData браузер должен сам поставить Content-Type с boundary
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const config: RequestInit = {
        ...options,
        headers,
    }

    // Если тело — объект и не FormData, превращаем в строку
    if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
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
    get: (path: string, options: any = {}) =>
        apiRequest(path, { ...options, method: 'GET' }),

    post: (path: string, body: any, options: any = {}) =>
        apiRequest(path, { ...options, method: 'POST', body }),

    put: (path: string, body: any, options: any = {}) =>
        apiRequest(path, { ...options, method: 'PUT', body }),

    delete: (path: string, options: any = {}) =>
        apiRequest(path, { ...options, method: 'DELETE' }),
}

export default api