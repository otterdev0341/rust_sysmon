import { useEffect, useState } from "react";
import { host_info } from "../../dto/systsm_dto";
import { SystemService } from "../../service/system"

export const SystemCard = () => {

    const [data, setData] = useState<host_info | null>(null);
    const [viewHostIpv4, setViewHostIpv4] = useState(false);
    const [viewHostIpv6, setViewHostIpv6] = useState(false);
    
    // load data to display
    useEffect(() => {
        const fetchData = async () => {
          const service = new SystemService();
          const result = await service.get_system_info();
          setData(result);
        };
    
        fetchData();
      }, []);
    


    const toggle_view_ipv4 = () => {
        setViewHostIpv4(!viewHostIpv4);
        
    }

    const toggle_view_ipv6 = () => {
        setViewHostIpv6(!viewHostIpv6)
    }

    return (
    
        <div className="container flex flex-col px-4 gap-y-1">
            <div id="host-name" className="flex justify-between">
                <div>
                    <p className="text-sm">HOST NAME</p>
                </div>
                <div>
                    <p>{data ? data.host_name : "Loading..."}</p>
                </div>
            </div>
            <div id="os-name" className="flex justify-between">
                <div className="">
                    <p className="text-sm">OS NAME</p>
                </div>
                <div>
                    <p>{data ? data.os_name : "Loding..."}</p>
                </div>
            </div>
            <div id="kernel-version" className="flex justify-between">
                <div>
                    <p className="text-sm">KERNEL VERSION</p>
                </div>
                <div>
                    <p>{data ? data.kernel_version : "Loding..."}</p>
                </div>
            </div>
            <div id="local-ipv4" className="flex justify-between">
                <div>
                    <p className="text-sm">HOST IPV4</p>
                </div>
                {
                    viewHostIpv4 ? 
                        <div>
                            <p>{data ? data.host_ipv4 : "Loding..."}</p>
                        </div> 
                            : 
                        <div>
                            <button onClick={() => toggle_view_ipv4()} className="bg-black px-1 rounded-md text-white ">show host ipv4</button>
                        </div>
                }
            </div>
            <div id="local-ipv6" className="flex justify-between">
                <div>
                    <p className="text-sm">HOST IPV6</p>
                </div>
                {
                    viewHostIpv6 ? 
                        <div>
                            <p>{data ? data.host_ipv6 : "Loding..."}</p>
                        </div> 
                            : 
                        <div>
                            <button onClick={() => toggle_view_ipv6()} className="bg-black px-1 rounded-md text-white ">show host ipv6</button>
                        </div>
                }

            </div>
        </div>
        
    )
}