import { Formik } from 'formik'
import * as Yup from 'yup'
import { useContext, useState } from 'react'

import AppContext from '../context'
import { TextInput, Button } from '../components'
import { signup } from '../services';

type FormValues = {
  username: string
  password: string
  confirmPassword: string
}

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(8)
    .matches(
      /^(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/,
      'Please include 1 number, upper case, lower case and special character'
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Must match the password'),
})

const Signup = () => {
  const { setSessionUser } = useContext(AppContext);
  const [error, setError] = useState<string>();

  const onSubmit = async ({ username, password }: FormValues) => {
    try {
      const data = await signup({
        username,
        password
      })
      setSessionUser({
        id: data.id
      })
    } catch (error) {
      setError('Something went wrong, try again later')
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
            <TextInput
              label="Confrim password"
              placeholder="Confirm password"
              type="password"
              value={values.confirmPassword}
              error={
                touched.confirmPassword &&
                errors.confirmPassword
              }
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button type="submit" onClick={handleSubmit}>Signup</Button>
          </>
        )}
      </Formik>
    </div>
  )
}
export default Signup
