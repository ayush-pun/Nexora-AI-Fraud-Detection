import { useState } from "react";

import {
  useBlacklist,
  useAddBlacklistEntry,
  useRemoveBlacklistEntry,
} from "../../services/admin/blacklist.query";


// ================================
// OPTIONS
// ================================

const ENTITY_TYPES = [
  "USER",
  "WALLET",
  "DEVICE",
  "IP_ADDRESS",
  "ACCOUNT",
];

const SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];


// ================================
// HELPERS
// ================================

const getSeverityClass = (severity) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";

    case "HIGH":
      return "bg-orange-100 text-orange-700";

    case "MEDIUM":
      return "bg-amber-100 text-amber-700";

    case "LOW":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};


const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString();
};


// ================================
// COMPONENT
// ================================

const BlackList = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    entityType: "USER",
    entityValue: "",
    reason: "",
    severity: "MEDIUM",
  });


  // ================================
  // GET BLACKLIST
  // ================================

  const {
    data: blacklist,
    isLoading,
    isError,
  } = useBlacklist();


  // ================================
  // ADD
  // ================================

  const {
    mutate: addBlacklist,
    isPending: isAdding,
    isError: addError,
    reset: resetAdd,
  } = useAddBlacklistEntry();


  // ================================
  // REMOVE
  // ================================

  const {
    mutate: removeBlacklist,
    isPending: isRemoving,
  } = useRemoveBlacklistEntry();


  // ================================
  // FORM HANDLERS
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.entityValue.trim()) {
      return;
    }

    addBlacklist(
      {
        entityType: formData.entityType,
        entityValue: formData.entityValue.trim(),
        reason: formData.reason.trim() || undefined,
        severity: formData.severity || undefined,
      },
      {
        onSuccess: () => {
          setFormData({
            entityType: "USER",
            entityValue: "",
            reason: "",
            severity: "MEDIUM",
          });

          setShowForm(false);
        },
      }
    );
  };


  const handleRemove = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this blacklist entry?"
    );

    if (!confirmed) return;

    removeBlacklist(id);
  };


  // ================================
  // LOADING
  // ================================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading blacklist...
        </p>
      </div>
    );
  }


  // ================================
  // ERROR
  // ================================

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-800">
          Unable to load blacklist
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Something went wrong while fetching blacklist entries.
        </p>
      </div>
    );
  }


  // ================================
  // PAGE
  // ================================

  return (
    <div>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Blacklist
          </h1>

          <p className="mt-2 text-slate-500">
            Manage users, wallets, devices, IP addresses,
            and accounts that are blocked from the system.
          </p>
        </div>


        <button
          type="button"
          onClick={() => {
            resetAdd();
            setShowForm((previous) => !previous);
          }}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {showForm
            ? "Cancel"
            : "+ Add to Blacklist"}
        </button>

      </div>


      {/* =====================================
          ADD FORM
      ====================================== */}

      {showForm && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Add Blacklist Entry
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add an entity that should be blocked by Nexora.
            </p>
          </div>


          {addError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Unable to add blacklist entry.
              Please check the values and try again.
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >

            {/* ENTITY TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Entity Type
              </label>

              <select
                name="entityType"
                value={formData.entityType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {ENTITY_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>


            {/* ENTITY VALUE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Entity Value
              </label>

              <input
                type="text"
                name="entityValue"
                value={formData.entityValue}
                onChange={handleChange}
                placeholder="Enter entity value"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>


            {/* REASON */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Reason
              </label>

              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why is this being blacklisted?"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>


            {/* SEVERITY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Severity
              </label>

              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {SEVERITIES.map((severity) => (
                  <option
                    key={severity}
                    value={severity}
                  >
                    {severity}
                  </option>
                ))}
              </select>
            </div>


            {/* SUBMIT */}

            <div className="md:col-span-2 flex justify-end">

              <button
                type="submit"
                disabled={
                  isAdding ||
                  !formData.entityValue.trim()
                }
                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding
                  ? "Adding..."
                  : "Add to Blacklist"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================
          BLACKLIST TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Active Blacklist Entries
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {blacklist?.length ?? 0} active entries
              </p>
            </div>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">

                <th className="px-6 py-4 font-medium">
                  Type
                </th>

                <th className="px-6 py-4 font-medium">
                  Entity
                </th>

                <th className="px-6 py-4 font-medium">
                  Reason
                </th>

                <th className="px-6 py-4 font-medium">
                  Severity
                </th>

                <th className="px-6 py-4 font-medium">
                  Added
                </th>

                <th className="px-6 py-4 text-right font-medium">
                  Action
                </th>

              </tr>
            </thead>


            <tbody>

              {!blacklist ||
              blacklist.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <p className="font-medium text-slate-600">
                      No blacklist entries
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      There are currently no active blacklist entries.
                    </p>
                  </td>

                </tr>

              ) : (

                blacklist.map((entry) => (

                  <tr
                    key={entry.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    {/* TYPE */}

                    <td className="px-6 py-4">

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {entry.entityType}
                      </span>

                    </td>


                    {/* ENTITY */}

                    <td className="px-6 py-4">

                      <p className="max-w-[260px] truncate text-sm font-medium text-slate-800">
                        {entry.entityValue}
                      </p>

                    </td>


                    {/* REASON */}

                    <td className="px-6 py-4">

                      <p className="max-w-[250px] truncate text-sm text-slate-600">
                        {entry.reason || "—"}
                      </p>

                    </td>


                    {/* SEVERITY */}

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityClass(
                          entry.severity
                        )}`}
                      >
                        {entry.severity || "—"}
                      </span>

                    </td>


                    {/* DATE */}

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(entry.createdAt)}
                    </td>


                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(entry.id)
                        }
                        disabled={isRemoving}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default BlackList;