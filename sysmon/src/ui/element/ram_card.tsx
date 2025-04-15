import { useRamData } from "../../context/ram_context";
import RamPieChart from "../chart/chart_ram";


export const RamCard = () => {

    const {ram_data} = useRamData();

    return(
        <div className="container flex flex-col">
            <div id="header section" className="flex justify-between px-3">
                <div className="flex flex-col">
                    <div>
                        <p>Total</p>
                    </div>
                    <div>
                        <p className="text-sm">{ram_data.ram_capacity.toFixed(2) + " GB"}</p>
                    </div>

                </div>
                <div className="flex flex-col ">
                    <div>
                        <p>Used</p>
                    </div>
                    <div>
                        <p className="text-sm">{ram_data.ram_used.toFixed(2) + " GB"}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Free</p>
                    </div>
                    <div>
                        <p className="text-sm">{ram_data.ram_free.toFixed(2) + " GB"}</p>
                    </div>
                </div>
            </div>
            <div id="graph-section" className="flex">
                <div id="ram-chart" className="  w-1/2 h-[110px] ">
                    <div className="w-full h-full">
                        <div className="flex justify-center px-3 pt-3">
                            <RamPieChart used_ram={ram_data.ram_used} free_ram={ram_data.ram_free} />    
                        </div>
                    </div>
                    <p className="text-sm">memory</p>
                </div>
                <div id="swap-chart" className="w-1/2 h-[110px]">
                    <div className="flex justify-center px-3 pt-2 ">
                    <RamPieChart used_ram={ram_data.swap_used} free_ram={ram_data.swap_free} />    
                    </div>
                    <p className="text-sm ">swap</p>
                </div>
            </div>
        </div>
    )
}