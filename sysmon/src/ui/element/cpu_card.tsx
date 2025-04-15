import { useCpuInfo } from "../../context/cpu_info_context"

export const CpuCard = () => {

    const {cpu_info} = useCpuInfo();

    return(
        <div className="flex justify-between px-8">
            <div id="core">
                <p className="text-sm">core: {cpu_info.core}</p>
            </div>
            <div id="thread">
                <p className="text-sm">thread: {cpu_info.thread}</p>
            </div>
        </div>
    )
}