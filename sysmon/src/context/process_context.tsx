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
        const interval = setInterval(async () => {
            try{
                const result: ResProcessDetailListDto = await service.get_process_info();
                setProcessDeque((prevDeque) => {
                    const updateDeque = new Deque<ResProcessDetailListDto>(prevDeque.maxSize);
                    prevDeque.getAll().forEach((item) => updateDeque.pushBack(item));
                    updateDeque.pushBack(result)
                    console.log("Deque updated:", updateDeque.getAll());
                    return updateDeque;
                });
            } catch(err) {
                console.error("Fail to fetch process info", err);
            }
        }, 2000);
        
        return () => clearInterval(interval);

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