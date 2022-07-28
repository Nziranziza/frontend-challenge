import { createContext } from 'react';

export interface User {
  id: number
}

type ContextValues = {
  user: User | null | undefined,
  setSessionUser: (user: User) => void
}
const initialValues = {
  user: null,
  setSessionUser: () => {}
}
const AppContext = createContext<ContextValues>(initialValues);

export default AppContext;