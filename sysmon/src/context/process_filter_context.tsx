import { createContext, ReactNode, useContext, useState } from "react";
import { ProcessFilterData } from "../dto/process_dto";


const defaultData: ProcessFilterData = {
    keyword: ""
}

type ProcessFilterContextType = {
    filter_data: ProcessFilterData,
    set_filter_data: React.Dispatch<React.SetStateAction<ProcessFilterData>>;
}

const ProcessFilterContext = createContext<ProcessFilterContextType | undefined>(undefined);

export const ProcessFilterProvider = ({ children} : {children : ReactNode}) => {

    const [filterKeyword, setFilterKeyword] = useState<ProcessFilterData>(defaultData);

    return(
      <ProcessFilterContext.Provider value={{filter_data: filterKeyword, set_filter_data: setFilterKeyword}}  >
        {children}
      </ProcessFilterContext.Provider>
    );
}

// Custom hook for easy usage
export const useFilterProcess = () => {
    const context = useContext(ProcessFilterContext)
    if (!context) {
      throw new Error("useRamData must be used within a RamProvider")
    }
    return context
  }