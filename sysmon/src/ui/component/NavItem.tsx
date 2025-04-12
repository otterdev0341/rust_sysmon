import { NavProps } from "../props/all_props"

export const NavItem = (data: NavProps) =>{



    return(
        <button className="bg-gray-200 px-2 rounded-md">
            {data.label}
        </button>
    )
}