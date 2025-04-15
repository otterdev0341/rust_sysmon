import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ResCpuUsed } from "../dto/systsm_dto";
import { Deque } from "../type/deque";
import { SystemService } from "../service/system";





const defaultData = new Deque<ResCpuUsed>(100);

type CpuUsedContextType = {
    cpuUsedDeque: Deque<ResCpuUsed>;
    setCpuUsedDeque: React.Dispatch<React.SetStateAction<Deque<ResCpuUsed>>>;
  };
  

export const CpuUsedContext = createContext<CpuUsedContextType | undefined>(undefined);

export const CpuUsedProvider = ({ children }: { children: ReactNode }) => {
    const [cpuUsedDeque, setCpuUsedDeque] = useState(defaultData);
    

    useEffect(() => {
        const service = new SystemService();
    
        const interval = setInterval(async () => {
          try {
            const result: ResCpuUsed = await service.get_cpu_used();

            // Update the deque by pushing the new result
            setCpuUsedDeque((prevDeque) => {
            // Create a new deque with the same max size
            const updatedDeque = new Deque<ResCpuUsed>(prevDeque.maxSize);

            // Append all previous data to the updated deque
            prevDeque.getAll().forEach((item) => updatedDeque.pushBack(item));

            // Push the new result into the deque
            updatedDeque.pushBack(result);

            // Log the updated deque state after the push
            console.log("Updated Deque:", updatedDeque.getAll());

            // Return the updated deque
            return updatedDeque;
        });
          } catch (error) {
            console.error("Fail to fetch CPU Used info:", error);
          }
        }, 2000); 
        
        return () => clearInterval(interval);
      }, []);

    return (
      <CpuUsedContext.Provider value={{ cpuUsedDeque, setCpuUsedDeque }}>
        {children}
      </CpuUsedContext.Provider>
    );
  };

  // Custom hook for easy usage
  export const useCpuUsed = () => {
      const context = useContext(CpuUsedContext)
      if (!context) {
        throw new Error("useCpuUsedContext must be used within a CpuUsedProvider")
      }
      return context
    }