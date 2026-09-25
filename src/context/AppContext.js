import React, { createContext, useMemo, useState } from 'react';

const AppContext = createContext();

export const UNIT_STATUSES = [
  'Repairing',
  'Acquired',
  'Evaluated',
  'Ready for sale',
  'Ready for pickup',
  'Unsold',
];

export const CLOSED_STATUSES = ['Sold', 'Released', 'Written off'];

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const investmentOf = (phone) =>
  num(phone.purchasePrice) +
  num(phone.partsCost) +
  num(phone.laborCost) +
  num(phone.otherExpenses);

// Profit realized by a record once it has left the bench.
const realizedOf = (phone) => {
  const status = String(phone.status || '').toLowerCase();
  if (status === 'written off') return -investmentOf(phone);
  if (status === 'sold' || status === 'released') {
    const revenue = num(phone.revenue) || num(phone.amountCharged);
    return revenue - investmentOf(phone);
  }
  return 0;
};

const pad4 = (value) => String(value).padStart(4, '0');

// Next RT-#### code, skipping any already in use.
const nextReference = (records) => {
  const max = records.reduce((acc, phone) => {
    const match = /(\d+)\s*$/.exec(String(phone.reference || ''));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 0);
  return `RT-${pad4(max + 1)}`;
};

// Display-safe reference for any record, old or new.
export const referenceOf = (phone) => {
  if (phone.reference) return phone.reference;
  const idTail = String(phone.id || '').match(/(\d{1,4})\s*-?\d*$/);
  return `RT-${pad4(idTail ? idTail[1] : 0)}`;
};

export const shortReference = (phone) => referenceOf(phone).replace(/^RT-/, '');

export const formatPeso = (amount) => {
  const value = Math.round(num(amount));
  const sign = value < 0 ? '-' : '';
  return `${sign}₱${Math.abs(value).toLocaleString('en-PH')}`;
};

export const AppProvider = ({ children }) => {
  // -----------------------------------------------------------------------
  // BACKEND: initial load
  // Replace the empty local state with a fetch when your API is ready:
  //   useEffect(() => {
  //     const load = async () => {
  //       const token = await AsyncStorage.getItem('token');
  //       const res = await fetch('https://YOUR_API/units', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setPhoneRecords(await res.json());
  //     };
  //     load();
  //   }, []);
  // -----------------------------------------------------------------------
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
    // BACKEND: POST https://YOUR_API/units  (body: record below)
    // then append the server response (which owns the id/reference):
    //   const res = await fetch(...);
    //   setPhoneRecords((prev) => [...prev, await res.json()]);
    const record = {
      id: phone.id || `${Date.now()}-${phoneRecords.length}`,
      status: 'Acquired',
      ...phone,
      reference: phone.reference || nextReference(phoneRecords),
    };
    setPhoneRecords([...phoneRecords, record]);
  };

  const editPhone = (phone) => {
    // BACKEND: PUT https://YOUR_API/units/:id  (body: phone)
    const updatedPhoneRecords = phoneRecords.map((p) => (p.id === phone.id ? phone : p));
    setPhoneRecords(updatedPhoneRecords);
  };

  const deletePhone = (phone) => {
    // BACKEND: DELETE https://YOUR_API/units/:id
    const updatedPhoneRecords = phoneRecords.filter((p) => p.id !== phone.id);
    setPhoneRecords(updatedPhoneRecords);
  };

  const calculateProfitLoss = () => {
    if (!user) return 0;
    if (user.jobType === 'Buy & Resell') {
      const totalInvestment = phoneRecords.reduce(
        (acc, phone) => acc + investmentOf(phone),
        0
      );
      const revenue = phoneRecords.reduce(
        (acc, phone) => acc + num(phone.revenue),
        0
      );
      return revenue - totalInvestment;
    }
    if (user.jobType === 'Customer Repair') {
      const revenue = phoneRecords.reduce(
        (acc, phone) => acc + num(phone.amountCharged),
        0
      );
      const repairExpenses = phoneRecords.reduce(
        (acc, phone) => acc + num(phone.repairExpenses),
        0
      );
      return revenue - repairExpenses;
    }
    return 0;
  };

  const stats = useMemo(() => {
    const statusCounts = {};
    UNIT_STATUSES.forEach((status) => {
      statusCounts[status] = 0;
    });

    let realizedProfit = 0;
    let soldOrReleased = 0;
    let writtenOff = 0;
    let tiedUpCapital = 0;
    let onBench = 0;
    let unsold = 0;

    phoneRecords.forEach((phone) => {
      const status = phone.status || 'Acquired';
      if (statusCounts[status] === undefined) statusCounts[status] = 0;
      statusCounts[status] += 1;

      const isClosed = CLOSED_STATUSES.includes(status);
      if (isClosed) {
        realizedProfit += realizedOf(phone);
        if (status === 'Written off') writtenOff += 1;
        else soldOrReleased += 1;
        return;
      }

      onBench += 1;
      tiedUpCapital += investmentOf(phone);
      if (status === 'Unsold') unsold += 1;
    });

    return {
      statusCounts,
      realizedProfit,
      soldOrReleased,
      writtenOff,
      tiedUpCapital,
      onBench,
      unsold,
      total: phoneRecords.length,
    };
  }, [phoneRecords]);

  const openTickets = useMemo(
    () => phoneRecords.filter((phone) => !CLOSED_STATUSES.includes(phone.status)),
    [phoneRecords]
  );

  const closedJobs = useMemo(
    () =>
      phoneRecords
        .filter((phone) => CLOSED_STATUSES.includes(phone.status))
        .map((phone) => ({ ...phone, reference: referenceOf(phone) })),
    [phoneRecords]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        phoneRecords,
        expenses,
        stats,
        closedJobs,
        openTickets,
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

export const useAppContext = () => React.useContext(AppContext);

export default AppContext;
