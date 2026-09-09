import { useState } from "react";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useTransfer } from "../../services/transaction/transaction.mutation";

const SendMoney = () => {
  const navigate = useNavigate();

  const [destinationWalletNumber, setDestinationWalletNumber] =
    useState("");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [successData, setSuccessData] = useState(null);

  const { mutate, isPending } = useTransfer();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destinationWalletNumber.trim()) {
      alert("Please enter the destination wallet number.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    mutate(
      {
        destinationWalletNumber: destinationWalletNumber.trim(),
        amount: Number(amount),
        description: description.trim(),
      },
      {
        onSuccess: (data) => {
          console.log("Transfer successful:", data);

          setSuccessData(data);

          setDestinationWalletNumber("");
          setAmount("");
          setDescription("");
        },

        onError: (error) => {
          console.error("Transfer error:", error);

          alert(
            error?.response?.data?.message ||
              "Transfer failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Send Money
            </h1>

            <p className="mt-1 text-slate-500">
              Transfer money securely to another Nexora wallet.
            </p>
          </div>
        </div>

        {/* Success */}
        {successData && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-100 p-2">
                <CheckCircle2
                  size={24}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h2 className="font-bold text-emerald-800">
                  Transfer Successful
                </h2>

                <p className="mt-1 text-sm text-emerald-700">
                  NPR {successData.amount} has been transferred
                  successfully.
                </p>

                <p className="mt-2 text-xs text-emerald-600">
                  Reference: {successData.transactionReference}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-2xl bg-indigo-100 p-4">
              <Send
                size={28}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Transfer Funds
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the recipient's wallet details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Wallet Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Destination Wallet Number
              </label>

              <input
                type="text"
                value={destinationWalletNumber}
                onChange={(e) =>
                  setDestinationWalletNumber(e.target.value)
                }
                placeholder="NX61009603459423"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Enter the recipient's Nexora wallet number.
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                  NPR
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-16 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Payment to Amit"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />

              {isPending
                ? "Processing Transfer..."
                : "Send Money"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SendMoney;