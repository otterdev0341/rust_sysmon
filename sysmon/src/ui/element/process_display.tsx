import { useMemo } from "react";
import { useProcess } from "../../context/process_context";
import { KillButton } from "../component/kill_button";
import { useFilterProcess } from "../../context/process_filter_context";

export const ProcessDesplay = () => {
    
    const {processDeque} = useProcess();
    const { filter_data } = useFilterProcess();
    // Use useMemo for performance
    const filtered_processes = useMemo(() => {
        const keyword = filter_data.keyword.toLowerCase();
        return processDeque.getAll().map((processList) => ({
            ...processList,
            data:
                keyword === ""
                    ? processList.data
                    : processList.data.filter((proc) =>
                          proc.process_name.toLowerCase().includes(keyword)
                      ),
        }));
    }, [processDeque, filter_data]);
    
    return(
        <div className="overflow-x-auto p-4">
            <table className="min-w-full table-auto ">
                <thead className="">
                    <tr>
                        <td className="text-sm">PID</td>
                        <td className="text-sm text-center">Process Name</td>
                        <td className="text-sm">CPU Usage (%)</td>
                        <td className="text-sm">Memory Used (MB)</td>
                        <td className="text-sm">Disk Read (MB)</td>
                        <td className="text-sm">Disk Write (MB)</td>
                        <td className="text-sm">Delete</td>
                    </tr>
                </thead>
                <tbody>
                    {filtered_processes.flatMap((processList) =>
                        processList.data.map((proc) => (
                            <tr key={proc.pid} className="hover:bg-gray-200 hover:rounded-md">
                                <td className="text-sm text-center">{proc.pid}</td>
                                <td className="text-sm text-center">{proc.process_name}</td>
                                <td className="text-sm text-center">{proc.cpu_use}</td>
                                <td className="text-sm text-center">{proc.memory_used}</td>
                                <td className="text-sm text-center">{proc.disk_read}</td>
                                <td className="text-sm text-center">{proc.disk_write}</td>
                                <td className="text-center"><KillButton key={proc.pid} pid_number={proc.pid} /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}