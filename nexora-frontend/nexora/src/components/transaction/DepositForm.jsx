import { useState } from "react";
import { useDeposit } from "../../services/transaction/transaction.mutation";

const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useDeposit();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    mutate(
      {
        amount: Number(amount),
        description: description.trim(),
      },
      {
        onSuccess: (data) => {
          console.log("Deposit successful:", data);

          alert("Deposit successful!");

          setAmount("");
          setDescription("");
        },

        onError: (error) => {
          console.error("Deposit error:", error);

          alert(
            error?.response?.data?.message ||
              "Deposit failed."
          );
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Deposit Money
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Add money to your wallet.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Initial wallet deposit"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
};

export default DepositForm;