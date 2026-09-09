import { useState } from "react";
import {
  ArrowLeft,
  ArrowDownToLine,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useWithdraw } from "../../services/transaction/transaction.mutation";

const WithdrawMoney = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [successData, setSuccessData] = useState(null);

  const { mutate, isPending } = useWithdraw();

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
          console.log("Withdraw successful:", data);

          setSuccessData(data);

          setAmount("");
          setDescription("");
        },

        onError: (error) => {
          console.error("Withdraw error:", error);

          alert(
            error?.response?.data?.message ||
              "Withdrawal failed. Please try again."
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
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              text-slate-600
              transition
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Withdraw Money
            </h1>

            <p className="mt-1 text-slate-500">
              Withdraw money securely from your Nexora wallet.
            </p>
          </div>

        </div>


        {/* Success Message */}
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
                  Withdrawal Successful
                </h2>

                <p className="mt-1 text-sm text-emerald-700">
                  NPR {successData.amount} has been withdrawn
                  successfully.
                </p>

                <p className="mt-2 text-xs text-emerald-600">
                  Reference:{" "}
                  {successData.transactionReference}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* Withdrawal Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Form Header */}
          <div className="mb-8">

            <div className="mb-4 inline-flex rounded-2xl bg-indigo-100 p-4">
              <ArrowDownToLine
                size={28}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Withdraw Funds
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the amount you want to withdraw from your wallet.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

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
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="1000"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    py-3
                    pl-16
                    pr-4
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter the amount you want to withdraw.
              </p>

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
                placeholder="Cash withdrawal"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-100
                "
              />

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-3.5
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <ArrowDownToLine size={18} />

              {isPending
                ? "Processing Withdrawal..."
                : "Withdraw Money"}

            </button>

          </form>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default WithdrawMoney;