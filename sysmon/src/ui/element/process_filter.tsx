import { useEffect, useState } from "react"
import { useFilterProcess } from "../../context/process_filter_context";

export const ProcessFilter = () => {

    const [searchKeyword, setSearchKeyword] = useState("");
    const { set_filter_data} = useFilterProcess();
    
    useEffect(() => {
        set_filter_data({keyword: searchKeyword})
    },[searchKeyword])
    return(
        <div className="cointainer mx-auto mt-4">
            <input className="bg-gray-200 rounded-md" onInput={(e) => setSearchKeyword((e.target as HTMLInputElement).value) } type="text" name="" id="" />
        </div>
    )
}