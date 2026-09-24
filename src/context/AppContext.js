import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [phoneRecords, setPhoneRecords] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addPhone = (phone) => {
    setPhoneRecords([...phoneRecords, phone]);
  };

  const editPhone = (phone) => {
    const updatedPhoneRecords = phoneRecords.map((p) => (p.id === phone.id ? phone : p));
    setPhoneRecords(updatedPhoneRecords);
  };

  const deletePhone = (phone) => {
    const updatedPhoneRecords = phoneRecords.filter((p) => p.id !== phone.id);
    setPhoneRecords(updatedPhoneRecords);
  };

  const calculateProfitLoss = () => {
    if (user.jobType === 'Buy & Resell') {
      const totalInvestment = phoneRecords.reduce(
        (acc, phone) => acc + phone.purchasePrice + phone.partsCost + phone.laborCost + phone.otherExpenses,
        0
      );
      const profitLoss = phoneRecords.reduce(
        (acc, phone) => acc + phone.revenue - totalInvestment,
        0
      );
      return profitLoss;
    } else if (user.jobType === 'Customer Repair') {
      const revenue = phoneRecords.reduce(
        (acc, phone) => acc + phone.amountCharged,
        0
      );
      const repairExpenses = phoneRecords.reduce(
        (acc, phone) => acc + phone.repairExpenses,
        0
      );
      return revenue - repairExpenses;
    }
    return 0;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        phoneRecords,
        expenses,
        login,
        logout,
        addPhone,
        editPhone,
        deletePhone,
        calculateProfitLoss,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
