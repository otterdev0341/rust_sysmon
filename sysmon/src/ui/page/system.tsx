import CpuUsedChart from "../chart/chart_cpu";
import { CpuCard } from "../element/cpu_card";
import { DiskCard } from "../element/disk_card";
import { RamCard } from "../element/ram_card";
import { SystemCard } from "../element/system_card";

export const System = () => {

    


    return(
        <div className="container flex flex-col w-full h-full bg-gray-400">
            <div id="upper" className="flex w-[100%] justify-center">
                <div className="w-1/2 text-center">
                    <div id="graph" className="h-[220px]">
                        <h4 className="pt-4 font-bold ">CPU</h4>
                        <div className="">
                            <CpuCard />
                        </div>
                        <div className="">
                            <CpuUsedChart />
                        </div>

                    </div>
                    
                </div>
                <div className="w-1/2 text-center">
                <div id="graph" className=" h-[220px]">
                        <h4 className="pt-4 font-bold">RAM</h4>
                        <RamCard />
                    </div>
                </div>
            </div>
            <div id="" className="flex h-[50%] w-[100%] justify-center">
                <div className="w-1/2 text-center">
                    <div className="h-full">
                        <h4 className="pt-4 font-bold">DISK</h4>
                        <DiskCard />
                    </div>
                    
                </div>
                <div className="w-1/2 text-center">
                <div className="bg-brown-400 h-1/2">
                        <h4 className="pt-4 font-bold">SYSTEM</h4>
                        <SystemCard />
                    </div>
                </div>
            </div>
        </div>
    )
}