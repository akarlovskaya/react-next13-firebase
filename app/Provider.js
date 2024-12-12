'use client';
import { createContext } from 'react';

export const UserContext = createContext({ user: null, username: null });

function Provider({ children }) {
  return (
    <UserContext.Provider value={{ user: {}, username: 'jeff' }}>
      {children}
    </UserContext.Provider>
  )
}

export default Provider;
