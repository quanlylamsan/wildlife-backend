import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null); // Create the context

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    user: null,
    // ... other initial values
  });

  // Your login/logout functions would go here...

  // The object passed to `value` must be defined
  const value = { ...authData /*, login, logout functions */ };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the context
export function useAuth() {
  return useContext(AuthContext);
}