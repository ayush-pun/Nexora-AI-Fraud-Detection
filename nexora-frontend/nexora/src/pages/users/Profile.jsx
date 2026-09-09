import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AtSign,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useCurrentUser } from "../../services/user/user.query";
import { useUpdateProfile } from "../../services/user/user.mutation";

const Profile = () => {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
  } = useCurrentUser();

  const {
    mutate: updateProfile,
    isPending: isUpdating,
  } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setMessage({
      type: "",
      text: "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
    });

    setMessage({
      type: "",
      text: "",
    });

    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      setMessage({
        type: "error",
        text: "First name is required.",
      });
      return;
    }

    if (!formData.lastName.trim()) {
      setMessage({
        type: "error",
        text: "Last name is required.",
      });
      return;
    }

    updateProfile(
      {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      },
      {
        onSuccess: () => {
          setMessage({
            type: "success",
            text: "Profile updated successfully.",
          });

          setIsEditing(false);
        },

        onError: (error) => {
          console.error("Profile update error:", error);

          setMessage({
            type: "error",
            text:
              error?.response?.data?.message ||
              "Unable to update your profile. Please try again.",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-32 animate-pulse bg-slate-200" />

            <div className="px-8 pb-8">
              <div className="-mt-12 flex items-end gap-5">
                <div className="h-24 w-24 animate-pulse rounded-3xl bg-slate-300" />

                <div className="space-y-3 pb-1">
                  <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </div>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <XCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-4 text-xl font-bold text-red-800">
              Unable to load profile
            </h2>

            <p className="mt-2 text-sm text-red-600">
              We couldn't retrieve your profile information.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "Nexora User";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const roleNames =
    user.roles?.map((role) =>
      typeof role === "string" ? role : role.name
    ) || [];

  const accountStatus = user.status || "ACTIVE";

  const isActive =
    accountStatus.toUpperCase() === "ACTIVE";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Profile
              </h1>

              <p className="mt-1 text-slate-500">
                Manage your Nexora account information.
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Feedback */}

        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <XCircle size={20} />
            )}

            <p className="text-sm font-medium">
              {message.text}
            </p>
          </div>
        )}

        {/* Main Profile Card */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Banner */}

          <div className="h-32 bg-gradient-to-r from-[#243B6B] via-indigo-700 to-violet-700" />

          {/* Identity */}

          <div className="px-8 pb-8">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
                  {initials}
                </div>

                <div className="pb-1">

                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    @{user.username || "user"}
                  </p>

                </div>
              </div>

              <div
                className={`flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold sm:self-auto ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isActive
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />

                {accountStatus}
              </div>

            </div>

            <div className="my-8 border-t border-slate-100" />

            {/* Personal Information */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <User
                    size={19}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Personal Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your registered account details
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6"
              >

                <div className="grid gap-4 md:grid-cols-2">

                  {/* First Name */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      First Name
                    </label>

                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <User
                          size={18}
                          className="text-slate-400"
                        />

                        <p className="font-semibold text-slate-800">
                          {user.firstName || "Not provided"}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Last Name */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Last Name
                    </label>

                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <User
                          size={18}
                          className="text-slate-400"
                        />

                        <p className="font-semibold text-slate-800">
                          {user.lastName || "Not provided"}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Username */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                      <AtSign
                        size={18}
                        className="text-slate-400"
                      />

                      <div className="min-w-0">

                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Username
                        </p>

                        <p className="mt-1 truncate font-semibold text-slate-800">
                          {user.username || "Not provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Email */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                      <Mail
                        size={18}
                        className="text-slate-400"
                      />

                      <div className="min-w-0">

                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Email Address
                        </p>

                        <p className="mt-1 truncate font-semibold text-slate-800">
                          {user.email || "Not provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Phone */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">

                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>

                    {isEditing ? (
                      <div className="relative">

                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                      </div>
                    ) : (
                      <div className="flex items-center gap-3">

                        <Phone
                          size={18}
                          className="text-slate-400"
                        />

                        <p className="font-semibold text-slate-800">
                          {user.phoneNumber || "Not provided"}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

                {/* Edit Actions */}

                {isEditing && (
                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={17} />

                      {isUpdating
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>
                )}

              </form>

            </div>

            {/* Account Security */}

            <div className="mt-10">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <ShieldCheck
                    size={19}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Account Security
                  </h3>

                  <p className="text-sm text-slate-500">
                    Current account status and permissions
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                {/* Status */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div>

                    <p className="font-semibold text-slate-800">
                      Account Status
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Current Nexora account status
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {accountStatus}
                  </span>

                </div>

                {/* Username Security */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div>

                    <p className="font-semibold text-slate-800">
                      Username
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your unique Nexora identifier
                    </p>

                  </div>

                  <CheckCircle2
                    size={24}
                    className="text-emerald-500"
                  />

                </div>

              </div>

            </div>

            {/* Roles */}

            {roleNames.length > 0 && (
              <div className="mt-8">

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Account Role
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {roleNames.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-700 shadow-sm"
                          >
                            {role}
                          </span>
                        ))}

                      </div>

                    </div>

                    <ShieldCheck
                      size={28}
                      className="text-indigo-500"
                    />

                  </div>

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

