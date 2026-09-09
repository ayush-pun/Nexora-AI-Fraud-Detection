import api from "../api";

// Get logged-in user's transaction history
export const getTransactions = async () => {
  const response = await api.get("/transactions");

  return response.data;
};

// Deposit money
export const deposit = async (data) => {
  const response = await api.post("/transactions/deposit", data);

  return response.data;
};

// Withdraw money
export const withdraw = async (data) => {
  const response = await api.post("/transactions/withdraw", data);

  return response.data;
};

// Transfer money to another wallet
export const transfer = async (data) => {
  const response = await api.post("/transactions/transfer", data);

  return response.data;
};