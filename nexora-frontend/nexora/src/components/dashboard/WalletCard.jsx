import { useState } from "react";
import {
  Eye,
  EyeOff,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { useWallet } from "../../services/wallet/wallet.query";

const WalletCard = () => {
  const [showBalance, setShowBalance] = useState(false);

  const {
    data: wallet,
    isLoading,
    isError,
  } = useWallet();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: wallet?.currency || "NPR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <section
      className="
        rounded-[28px]
        bg-gradient-to-br
        from-[#243B6B]
        to-[#1F3663]
        px-7
        py-6
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(36,59,107,0.35)]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Wallet
              size={25}
              className="text-white"
            />
          </div>

          <div>
            <p className="text-sm text-slate-300">
              Wallet Balance
            </p>

            <h2 className="text-xl font-semibold">
              Nexora Wallet
            </h2>
          </div>

        </div>

        <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-300">
          ● {wallet?.status || "Active"}
        </span>

      </div>

      {/* Balance */}

      <div className="mt-8">

        <p className="text-sm text-slate-300">
          Available Balance
        </p>

        <div className="mt-3 flex items-center gap-3">

          <h1 className="text-[42px] font-bold tracking-tight">

            {isLoading
              ? "Loading..."
              : isError
              ? "Unavailable"
              : showBalance
              ? formatCurrency(wallet?.balance)
              : "रु XXXXXX"}

          </h1>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="rounded-xl bg-white/10 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            {showBalance ? (
              <EyeOff
                size={20}
                className="text-white"
              />
            ) : (
              <Eye
                size={20}
                className="text-white"
              />
            )}
          </button>

        </div>

      </div>

      <div className="my-6 border-t border-white/20" />

      {/* Stats */}

      <div className="grid grid-cols-3 gap-4">

        {/* Today's Spend */}

        <div
          className="
            rounded-2xl
            bg-white/5
            p-3
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/10
          "
        >

          <div className="flex items-center gap-2">

            <ArrowUpRight
              size={17}
              className="text-indigo-200"
            />

            <span className="text-xs text-slate-300">
              Today's Spend
            </span>

          </div>

          <p className="mt-2 text-lg font-semibold">
            रु XXX
          </p>

        </div>

        {/* Security */}

        <div
          className="
            rounded-2xl
            bg-white/5
            p-3
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/10
          "
        >

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={17}
              className="text-emerald-300"
            />

            <span className="text-xs text-slate-300">
              Security
            </span>

          </div>

          <p className="mt-2 text-lg font-semibold">
            Protected
          </p>

        </div>

        {/* Transactions */}

        <div
          className="
            rounded-2xl
            bg-white/5
            p-3
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/10
          "
        >

          <div className="flex items-center gap-2">

            <Wallet
              size={17}
              className="text-indigo-200"
            />

            <span className="text-xs text-slate-300">
              Transactions
            </span>

          </div>

          <p className="mt-2 text-lg font-semibold">
            0
          </p>

        </div>

      </div>

    </section>
  );
};

export default WalletCard;