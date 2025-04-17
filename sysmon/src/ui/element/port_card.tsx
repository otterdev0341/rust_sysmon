import { usePortList } from "../../context/port_context";

export const PortCard = () => {

    const {port_list} = usePortList();

    return(
        <div className="container mx-auto display flex flex-wrap px-4 gap-x-2 gap-y-2 pt-2 mt-4">
            {
                port_list.data.map((val, idx) => (
                    <div key={idx} 
                    className="px-2 py-1 bg-gray-700 border text-sm
                            border-white text-white rounded-xl">
                        {val}
                    </div>
                ))
            }
        </div>
    );
}