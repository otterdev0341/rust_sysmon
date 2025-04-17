import { NavLink } from "react-router-dom";

export const Navbar = () => {
    const base_class = "px-2 py-1 rounded-md text-gray border border-white";
    const route_table = [
        { path: "/", label: "System" },
        { path: "process", label: "Process" },
        { path: "network", label: "Network" },
    ];

    return (
        <nav className="flex gap-2 py-2 justify-evenly bg-gray-400">
            {route_table.map((route, idx) => (
                <NavLink
                    key={idx}
                    to={route.path}
                    end={route.path === "/"}
                    className={({ isActive }) =>
                        `${base_class} ${isActive ? "bg-yellow-200" : "bg-gray-400"}`
                    }
                >
                    {route.label}
                </NavLink>
            ))}
        </nav>
    );
};
