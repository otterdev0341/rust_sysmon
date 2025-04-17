
import { ProcessService } from "../../service/process";

export interface PidProps {
    pid_number: number;
}

export const KillButton = ({ pid_number }: PidProps) => {

    const kill_process = async () => {
        const service = new ProcessService();
        try {
            const result = await service.kill_process_by_id(pid_number);
            if (!result) {
                console.log("fail to kill")
            }
        } catch(error){
            console.error("Fail to kill process", error);
        }
    }

    return(
        <button onClick={() => kill_process()} 
            className="px-1 bg-orange-200 rounded-md border-2 hover:bg-white">
            Kill
        </button>
    );
}