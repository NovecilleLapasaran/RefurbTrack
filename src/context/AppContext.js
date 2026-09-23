import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [phoneRecords, setPhoneRecords] = useState([]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addPhone = (phone) => {
    setPhoneRecords([...phoneRecords, phone]);
  };

  return (
    <AppContext.Provider value={{ user, phoneRecords, login, logout, addPhone }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
