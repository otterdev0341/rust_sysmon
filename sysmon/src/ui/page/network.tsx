import { PortCard } from "../element/port_card";

export const Network = () => {
    return (
        <div className="flex flex-col h-full w-full text-center">
            <div id="network" className="bg-green-200 h-1/2 w-full">
                <h3 className="mt-2">Traffic</h3>
            </div>
            <div id="port" className="bg-purple-300 h-1/2 w-full">
                <h3 className="mt-2">Port Allow</h3>
                <PortCard />
            </div>
        </div>
    );
};
