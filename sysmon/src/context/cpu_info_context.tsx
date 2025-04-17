import { ResCpuInfo } from "../dto/systsm_dto";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SystemService } from "../service/system";

const defaultData: ResCpuInfo = {
    core: 0,
    thread:0
}

type CpuInfoContextType = {
    cpu_info: ResCpuInfo
}

const CpuInfoContext = createContext<CpuInfoContextType | undefined>(undefined);

export const CpuInfoProvider = ({children} : {children: ReactNode}) => {
    
    const [cpuInfo, setCpuInfo] = useState<ResCpuInfo>(defaultData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const service = new SystemService();
                const result: ResCpuInfo = await service.get_cpu_info();
                setCpuInfo(result);
            } catch (error) {
                console.error("Failed to fetch Cpu Info", error);
            }
        }
        fetchData();
    },[])

    return(
        <CpuInfoContext.Provider value={{cpu_info: cpuInfo}}>
            {children}
        </CpuInfoContext.Provider>
    )
}

// Custom hook for easy usage
export const useCpuInfo = () => {
    const context = useContext(CpuInfoContext)
    if (!context) {
      throw new Error("useRamData must be used within a RamProvider")
    }
    return context
  }