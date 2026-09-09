import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Wallet,
    Ban,
    LogOut,
    X,
    BarChart3,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";


const AdminSidebar = ({ isOpen, onClose }) => {

    const navigate = useNavigate();


    const navigation = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },

        {
            name: "Fraud Cases",
            path: "/admin/fraud-cases",
            icon: ShieldAlert,
        },

        {
            name: "Wallets",
            path: "/admin/wallets",
            icon: Wallet,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
        },

        {
            name: "Blacklist",
            path: "/admin/blacklist",
            icon: Ban,
        },

    ];


    const handleLogout = () => {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };


    return (
        <>

            {/* Mobile overlay */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                    onClick={onClose}
                />
            )}


            {/* Sidebar */}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >

                {/* Logo */}

                <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Nexora
                        </h1>

                        <p className="text-xs font-medium text-indigo-600">
                            Admin Panel
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* Navigation */}

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">

                    {navigation.map((item) => {

                        const Icon = item.icon;


                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >

                                <Icon size={19} />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>


                {/* Logout */}

                <div className="border-t border-slate-200 p-4">

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >

                        <LogOut size={19} />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>

        </>
    );
};


export default AdminSidebar;