import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ResPortListDto } from "../dto/network.dto";
import { NetworkService } from "../service/network";

const defaultData: ResPortListDto = {
    size: 0,
    data: []
}

type PortListContextType = {
    port_list: ResPortListDto
}

const PortListContext = createContext<PortListContextType | undefined>(undefined);

export const PortListProvider = ({children} : {children: ReactNode}) => {

    const [portData, setPortData] = useState<ResPortListDto>(defaultData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const service = new NetworkService();
                const result: ResPortListDto = await service.get_port_detail();
                setPortData(result);
            } catch(error) {    
                console.error("Failed to fetch Port info", error);
            }
        }
        fetchData();
    },[])

    return(
        <PortListContext.Provider value={{ port_list: portData }}>
            {children}
        </PortListContext.Provider>
    )
}

// Custom hook for easy usage
export const usePortList = () => {
    const context = useContext(PortListContext)
    if (!context) {
      throw new Error("useRamData must be used within a RamProvider")
    }
    return context
  }