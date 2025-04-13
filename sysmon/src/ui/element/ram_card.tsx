import { useEffect, useState } from "react"
import { RamDataDto } from "../../dto/systsm_dto"
import { SystemService } from "../../service/system";
import { debounce, random } from "lodash";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const RamCard = () => {

    let [ramData, setRamData] = useState<RamDataDto | null>(null);

    useEffect(() => {
        const service = new SystemService();
        const fetchData = debounce(async () => {
            const result = await service.get_ram_info();
            setRamData(result);
        }, 1000); // Wait 4 seconds before making another request
    
        fetchData(); // Initial call
        const interval = setInterval(fetchData, 1000); // 4 second interval
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    let max_ram = 0;
    let used_ram = 0;
    let free_ram = 0;
    let max_swap = 0;
    let used_swap = 0;
    let free_swap = 0;
    if (ramData) {
        max_ram = ramData.ram_capacity;
        used_ram = ramData.ram_used;
        free_ram = max_ram - used_ram;

        max_swap = ramData.swap_capacity;
        used_swap = ramData.swap_used;
        free_swap = max_swap - used_swap;
    }

    

    // Chart.js data configuration
    const chart_data = {
        // labels: ['Free RAM', 'Used RAM'],
        datasets: [
            {
                data: [free_ram, used_ram],
                backgroundColor: ['green', 'red'], // Green for free, red for used
                borderWidth: 0, // Remove border
            },
        ],
    };
    const chart_swap_data = {
        datasets: [
            {
                data: [free_swap, used_swap],
                backgroundColor: ['green', 'red'], // Green for free, red for used,
                borderWidth: 0,
            },
        ],
    };
    const chart_options = {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to resize and not maintain the aspect ratio
        cutout: 0, // No cutout, solid donut chart (can be 0 or a value less than 50 for full donut)
        plugins: {
            tooltip: {
                callbacks: {
                    // Customize the tooltip label
                    label: (context: any) => {
                        const datasetIndex = context.datasetIndex;
                        const dataIndex = context.dataIndex;
    
                        // Use the respective value for each segment
                        const value = datasetIndex === 0 ? 
                            (dataIndex === 0 ? free_ram : used_ram) :
                            0;
    
                        return `${dataIndex === 0 ? "Free" : "Used"}: ${value.toFixed(2)} GB`;
                    },
                },
            },
        },
    };


    return(
        <div className="container flex flex-col">
            <div id="header section" className="flex justify-between px-3">
                <div className="flex flex-col">
                    <div>
                        <p>Total</p>
                    </div>
                    <div>
                        <p className="text-sm">{max_ram.toFixed(2) + " GB"}</p>
                    </div>

                </div>
                <div className="flex flex-col ">
                    <div>
                        <p>Used</p>
                    </div>
                    <div>
                        <p className="text-sm">{used_ram.toFixed(2) + " GB"}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Free</p>
                    </div>
                    <div>
                        <p className="text-sm">{free_ram.toFixed(2) + " GB"}</p>
                    </div>
                </div>
            </div>
            <div id="graph-section" className="flex">
                <div id="ram-chart" className="  w-2/3 h-[110px] mt-1">
                    <p className="text-sm">memory</p>
                    <div className="w-full h-full">
                        <Doughnut data={chart_data} options={chart_options}/>
                    </div>
                </div>
                <div id="swap-chart" className="w-1/3 h-[125px]">
                    <p className="text-sm pt-4">swap</p>
                    <div className="w-full h-1/2 flex flex-col justify-end">
                        
                        <Doughnut data={chart_swap_data} options={chart_options}/>
                    </div>
                </div>
            </div>
        </div>
    )
}