import API from '../api/axios'

type SignupLoginBody = {
    username: string
    password: string
}

export const login = (body: SignupLoginBody) => {
    return API.post('/login', body)
}

export const signup = (body: SignupLoginBody) => {
    return API.post('/signup', body)
}


export const getCurrentUser = () => {
  return API.get('/session')
}