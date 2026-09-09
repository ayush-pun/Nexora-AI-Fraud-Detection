import {
  useUsers,
  useUpdateUserStatus,
} from "../../services/admin/users.query";

const STATUS_OPTIONS = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "LOCKED",
  "CLOSED",
];

const Users = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useUsers();

  const {
    mutate: updateStatus,
    isPending: isUpdating,
  } = useUpdateUserStatus();

  const handleStatusChange = (userId, status) => {
    updateStatus({
      id: userId,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading users...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-800">
          Unable to load users
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Something went wrong while fetching users.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-2 text-slate-500">
          Manage Nexora wallet users and their account status.
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">
                  User
                </th>

                <th className="px-6 py-4 font-medium">
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Phone
                </th>

                <th className="px-6 py-4 font-medium">
                  Role
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                <th className="px-6 py-4 font-medium">
                  Verified
                </th>

                <th className="px-6 py-4 font-medium">
                  Last Login
                </th>
              </tr>
            </thead>

            <tbody>
              {!users || users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleNames =
                    user.roles?.map((role) => role.name) || [];

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            @{user.username}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.phoneNumber || "—"}
                      </td>

                      {/* Roles */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {roleNames.length > 0 ? (
                            roleNames.map((role) => (
                              <span
                                key={role}
                                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                              >
                                {role.replace("ROLE_", "")}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <select
                          value={user.status}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleStatusChange(
                              user.id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Email Verified */}
                      <td className="px-6 py-4">
                        {user.emailVerified ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Not Verified
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.lastLoginAt
                          ? new Date(
                              user.lastLoginAt
                            ).toLocaleString()
                          : "Never"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;