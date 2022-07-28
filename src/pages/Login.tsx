import { Formik } from 'formik'
import * as Yup from 'yup'
import { useContext, useState } from 'react'

import AppContext from '../context'
import { TextInput, Button } from '../components'
import { login } from '../services'

type FormValues = {
  username: string
  password: string
}

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
})

const Login = () => {
  const { setSessionUser } = useContext(AppContext);
  const [error, setError] = useState<string>();

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await login(values)
      setSessionUser({
        id: data.id
      })
    } catch (error) { 
      setError('Login failed, check your credentials and try again')
    }
  }

  return (
    <div>
      {error && <span className="error">{error}</span>}
      <Formik
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
        validationSchema={loginValidationSchema}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              label="Username"
              placeholder="Enter username"
              type="text"
              value={values.username}
              error={touched.username && errors.username}
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextInput
              label="Password"
              placeholder="Enter password"
              type="password"
              value={values.password}
              error={touched.password && errors.password}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button type="submit" onClick={handleSubmit}>
              Login
            </Button>
          </>
        )}
      </Formik>
    </div>
  )
}
export default Login
