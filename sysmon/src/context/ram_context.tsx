import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { RamDataDto } from "../dto/systsm_dto"
import { invoke } from "@tauri-apps/api/core"



// Define default structure to avoid undefined errors
const defaultData: RamDataDto = {
    ram_capacity: 0,
    ram_used: 0,
    ram_free: 0,
    swap_used: 0,
    swap_capacity: 0,
    swap_free: 0
}
  
type RamContextType = {
    ram_data: RamDataDto
}

const RamContext = createContext<RamContextType | undefined>(undefined)

export const RamProvider = ({children}: {children: ReactNode}) => {

    const [ramData, setRamData] = useState<RamDataDto>(defaultData);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await invoke<RamDataDto>("get_ram_info")
            setRamData(result)
          } catch (error) {
            console.error("Failed to fetch RAM info:", error)
          }
        }
    
        fetchData() // fetch immediately
    
        const interval = setInterval(fetchData, 2000) // fetch every second
    
        return () => clearInterval(interval)
      }, [])

    return(
        <RamContext.Provider value={{ ram_data: ramData }}>
            {children}
        </RamContext.Provider>
    )
}

// Custom hook for easy usage
export const useRamData = () => {
    const context = useContext(RamContext)
    if (!context) {
      throw new Error("useRamData must be used within a RamProvider")
    }
    return context
  }