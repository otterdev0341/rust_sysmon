import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ResProcessDetailListDto } from "../dto/process_dto";
import { Deque } from "../type/deque";
import { ProcessService } from "../service/process";


const defaultData = new Deque<ResProcessDetailListDto>(3);

type ProcessContextType = {
    processDeque: Deque<ResProcessDetailListDto>;
    setProcessDeque: React.Dispatch<React.SetStateAction<Deque<ResProcessDetailListDto>>>;
}

export const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export const ProcessProvider = ({ children }: { children: ReactNode}) => {

    const [processDeque, setProcessDeque] = useState(defaultData);

    useEffect(() => {
        const service = new ProcessService();
            const fetchData = async () => {
            try{
                const result: ResProcessDetailListDto = await service.get_process_info();
                const newDeque = new Deque<ResProcessDetailListDto>(defaultData.maxSize);
                newDeque.pushBack(result)
                setProcessDeque(newDeque);
               
            } catch(err) {
                console.error("Fail to fetch process info", err);
            }
        }
        fetchData();
    },[])

    return(
        <ProcessContext.Provider value={{processDeque, setProcessDeque}}>
            {children}
        </ProcessContext.Provider>
    )
}

// Custom hook for easy usage
export const useProcess = () => {
    const context = useContext(ProcessContext)
    if (!context) {
    throw new Error("useCpuUsedContext must be used within a CpuUsedProvider")
    }
    return context
}