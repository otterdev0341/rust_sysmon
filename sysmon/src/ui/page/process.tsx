import { ProcessDesplay } from "../element/process_display";
import { ProcessFilter } from "../element/process_filter";


export const Process = () => {

    
    
    return(
        <div className="flex flex-col bg-gray-400">
            <ProcessFilter />
            <ProcessDesplay />
        </div>
    )
}