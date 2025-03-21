import React, { createContext, useState, useContext } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook para acceder al contexto
export const useAuthContext = () => useContext(AuthContext);

// Proveedor del contexto para envolver la aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para guardar el usuario

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
