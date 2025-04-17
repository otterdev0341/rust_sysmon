import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ResInterfaceTrafficDto } from "../dto/network.dto";
import { Deque } from "../type/deque";
import { NetworkService } from "../service/network";


const defaultData = new Deque<ResInterfaceTrafficDto>(100);

type InterfaceTrafficType = {
    trafficDeque: Deque<ResInterfaceTrafficDto>;
    setTrafficDeque: React.Dispatch<React.SetStateAction<Deque<ResInterfaceTrafficDto>>>;
}

export const InterfaceTrafficContext = createContext<InterfaceTrafficType | undefined>(undefined);

export const InterfaceTrafficProvider = ({children} :{children : ReactNode}) => {

    const [trafficDeque, setTrafficDeque] = useState(defaultData);

    useEffect(() => {
        const service = new NetworkService();
        const interval = setInterval( async () => {
            try{
                const result: ResInterfaceTrafficDto = await service.get_network_traffic();
                setTrafficDeque((prevDeque) => {
                    const updatedDeque = new Deque<ResInterfaceTrafficDto>(prevDeque.maxSize);
                    prevDeque.getAll().forEach((item) => updatedDeque.pushBack(item));
                    updatedDeque.pushBack(result);
                    return updatedDeque;
                })
            } catch(err) {
                console.error("fail to fetch network traffic",err);
            }
        }, 2000);
        return () => clearInterval(interval);
    },[])

    return(
        <InterfaceTrafficContext.Provider value={{trafficDeque: trafficDeque, setTrafficDeque: setTrafficDeque}}>
            {children}
        </InterfaceTrafficContext.Provider>
    );
}

export const useNetworkTraffic = () => {
    const context = useContext(InterfaceTrafficContext);
    if (!context) {
        throw new Error("useNetworkTraffic must be used within a InterfaceTrafficProvider");
    }
    return context
}