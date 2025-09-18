// WalletPro.jsx
import React, { useMemo, useState } from "react";

/* ---------- helpers ---------- */
const fmtMoney = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatTxDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatTxAmount = (n) =>
  `${n > 0 ? "+" : n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

/* ---------- demo data (safe to remove) ---------- */
const demoTx = [
  { date: "2025-09-11", type: "Deposit",  amount: 2500,  status: "Completed" },
  { date: "2025-09-09", type: "Withdraw", amount: -300,  status: "Pending"   },
  { date: "2025-08-30", type: "Deposit",  amount: 1500,  status: "Completed" },
];

export default function WalletPro() {
  const [balance] = useState(10000);
  const [tab, setTab] = useState("all"); // all | deposits | withdrawals
  const [loading, setLoading] = useState(false);

  const dollars = useMemo(() => Math.floor(balance).toLocaleString("en-US"), [balance]);
  const cents   = useMemo(() => (balance % 1).toFixed(2).split(".")[1] || "00", [balance]);

  const tx = useMemo(() => {
    if (tab === "deposits")     return demoTx.filter((t) => t.type === "Deposit");
    if (tab === "withdrawals")  return demoTx.filter((t) => t.type === "Withdraw");
    return demoTx;
  }, [tab]);

  const onDeposit = async () => {
    setLoading(true);
    try { /* TODO: open deposit modal / route */ await new Promise(r => setTimeout(r, 350)); }
    finally { setLoading(false); }
  };

  const onWithdraw = async () => {
    setLoading(true);
    try { /* TODO: open withdraw modal / route */ await new Promise(r => setTimeout(r, 350)); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-10">
      <section className="rounded-xl border border-white/5 bg-[#111726] shadow-[0_12px_24px_-18px_rgba(0,0,0,0.6)] overflow-hidden">

        {/* HEADER */}
        <header className="px-6 sm:px-8 py-5 bg-[#0F1524] border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#111726] border border-white/10 grid place-items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C87933" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Current balance</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">USD</p>
              </div>
            </div>

            <div className="text-right leading-none">
              <span className="text-[42px] sm:text-[56px] font-bold tracking-tight tabular-nums text-slate-100">
                {dollars}
              </span>
              <span className="ml-0.5 text-xl text-slate-300 align-baseline inline-block translate-y-[1px]">
                .{cents}
              </span>
            </div>
          </div>
        </header>

        {/* ACTIONS */}
        <div className="px-6 sm:px-8 py-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onDeposit}
              disabled={loading}
              className="group flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
                         bg-[#C87933] text-[#0E1322] font-semibold
                         hover:bg-[#D98324] active:scale-[.99]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87933]/50 transition"
            >
              <svg className="h-4 w-4 opacity-80 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
              </svg>
              {loading ? "Processing…" : "Deposit"}
            </button>

            <button
              type="button"
              onClick={onWithdraw}
              disabled={loading}
              className="group flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5
                         border border-[#C87933] text-[#C87933] font-semibold
                         hover:bg-[#C87933]/10 hover:text-[#F3ECDC]
                         active:scale-[.99]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87933]/50 transition"
            >
              <svg className="h-4 w-4 opacity-80 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V8m0 0l4 4m-4-4l-4 4M4 4h16" />
              </svg>
              {loading ? "Processing…" : "Withdraw"}
            </button>
          </div>
        </div>

        {/* MICRO METRICS */}
        <div className="px-6 sm:px-8 pb-4">
          <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="rounded-lg bg-[#0F1524] border border-white/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Available</p>
              <p className="mt-0.5 font-semibold text-slate-100 tabular-nums text-[16px]">$ {fmtMoney(balance)}</p>
            </div>
            <div className="rounded-lg bg-[#0F1524] border border-white/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">On hold</p>
              <p className="mt-0.5 font-semibold text-slate-100 tabular-nums text-[16px]">$ 0.00</p>
            </div>
            <div className="rounded-lg bg-[#0F1524] border border-white/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Pending</p>
              <p className="mt-0.5 font-semibold text-slate-100 tabular-nums text-[16px]">$ 0.00</p>
            </div>
          </div>
        </div>

        {/* ACCOUNT HEALTH */}
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex items-center gap-4 rounded-lg border border-[#1b2336] bg-[#0F1524] px-4 py-3">
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Verified identity
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Secure withdrawals
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> 2FA recommended
              </span>
            </div>
            <div className="flex-1" />
            <button type="button" className="text-xs font-semibold text-[#EFB570] hover:text-[#FDE3B1] underline underline-offset-4">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* TRANSACTIONS HEADER + TABS */}
        <div className="px-6 sm:px-8 pb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200">Recent Transactions</h3>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setTab("all")}
              className={`px-1.5 py-1 font-medium transition ${
                tab === "all"
                  ? "text-slate-200 underline underline-offset-8 decoration-[#C87933] decoration-2"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab("deposits")}
              className={`px-1.5 py-1 font-medium transition ${
                tab === "deposits"
                  ? "text-slate-200 underline underline-offset-8 decoration-[#C87933] decoration-2"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setTab("withdrawals")}
              className={`px-1.5 py-1 font-medium transition ${
                tab === "withdrawals"
                  ? "text-slate-200 underline underline-offset-8 decoration-[#C87933] decoration-2"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* TRANSACTIONS BODY */}
        <div className="px-6 sm:px-8 pb-8">
          {tx.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2 py-10 rounded-lg border border-dashed border-[#C87933]/25 bg-[#0F1524]/50">
              <div className="h-10 w-10 rounded-full bg-[#C87933]/15 grid place-items-center">
                <svg className="w-5 h-5 text-[#C87933]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8a8 8 0 1116 0c0 4.418-3.582 8-8 8z" />
                </svg>
              </div>
              <p className="text-slate-300 font-medium">No recent transactions</p>
              <p className="text-slate-400 text-sm max-w-sm">Your deposits, withdrawals, and transfers will show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rounded-xl overflow-hidden">
                <thead className="bg-[#0F1524]">
                  <tr className="border-b border-[#C87933]/20">
                    <th className="py-2 px-3 text-[#F3ECDC]/80 font-medium">Date</th>
                    <th className="py-2 px-3 text-[#F3ECDC]/80 font-medium">Type</th>
                    <th className="py-2 px-3 text-[#F3ECDC]/80 font-medium">Amount</th>
                    <th className="py-2 px-3 text-[#F3ECDC]/80 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C87933]/12">
                  {tx.map((t, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-2 px-3 text-[#F3ECDC] whitespace-nowrap">{formatTxDate(t.date)}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${t.type === "Deposit"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold whitespace-nowrap">
                        <span className={t.amount > 0 ? "text-green-400" : "text-red-400"}>
                          {formatTxAmount(t.amount)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${t.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
