import { Chart } from "chart.js";
import { useEffect } from "react";
import { SystemCard } from "../element/system_card";

export const System = () => {

    


    return(
        <div className="container flex flex-col">
            <div id="upper" className="flex h-[50%] bg-amber-300 w-[100%] justify-center">
                <div className="w-1/2 text-center">
                    <div id="graph" className="bg-red-200 h-[220px]">
                        <h4 className="pt-4 font-bold">CPU</h4>
                        <canvas id="graph-canvas"></canvas>
                    </div>

                </div>
                <div className="w-1/2 text-center">
                <div id="graph" className="bg-pink-400 h-[220px]">
                        <h4 className="pt-4 font-bold">RAM</h4>
                        <canvas id="graph-canvas"></canvas>
                    </div>
                </div>
            </div>
            <div id="" className="flex h-[50%] bg-blue-300 w-[100%] justify-center">
                <div className="w-1/2 text-center">
                    <div className="bg-green-400 h-[220px]">
                        <h4 className="pt-4 font-bold">DISK</h4>
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