import { useEffect, useState } from "react"
import { DiskDataDto, ResListDiskDataDto } from "../../dto/systsm_dto";
import { SystemService } from "../../service/system";

export const DiskCard = () => {
    
    let [diskData, setDiskData] = useState<ResListDiskDataDto | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const service = new SystemService();
            const result = await service.get_disks_info();
            setDiskData(result);
        }

        fetchData();
    },[]);




    return(
        <div id="disk-show-area" className="px-2 max-h-[90%] overflow-y-auto">
            <div id="header-section" className="">
                <h4 className="mt-2">PHYCICAL DRIVE: {diskData?.phycical_drive}</h4>
            </div>
            <div id="partition-section-display" className="flex flex-col px-2">
                {
                    diskData && diskData.data.map((item: DiskDataDto, idx) => (
                        item.disk_free_byte > 100 ? <DiskInfo key={idx} data={item} /> : <p></p>
                        
                    ))
                }
            </div>

        </div>
    )
}

export const DiskInfo = ({ data }: { data: DiskDataDto }) => {

    return(
        <div className="flex flex-col">
            <div id="header" className="mt-1 flex justify-between">
                <div>
                    Data {extract_disk_name(data.name)}
                </div>
                <div>
                    Size {mb_to_gb(data.disk_capacity_byte)} GB
                </div>
            </div>
            <div id="line">
                <DiskGraph max={data.disk_capacity_byte} used={data.disk_used_byte} />
            </div>
            <div>

            </div>
        </div>
    )
}

export const DiskGraph = ({ max, used }: DiskGraphProps) => {
    const free = max - used;
  
    const usedPercent = max > 0 ? (used / max) * 100 : 0;
    const freePercent = max > 0 ? (free / max) * 100 : 0;
  
    const formatPercent = (value: number): string => {
      return value.toFixed(2) + "%";
    };
  
    return (
      <div className="w-full flex flex-col space-y-1 mt-1">
        {/* Bar chart */}
        <div className="w-full h-6 bg-gray-200 rounded overflow-hidden flex">
          <div
            className="bg-blue-500 h-full block"
            style={{ width: `${usedPercent}%` }}
          >
            <p className="text-sm">{formatPercent(usedPercent)}</p>
          </div>
          <div
            className="bg-green-500 h-full block"
            style={{ width: `${freePercent}%` }}
          >
            <p className="text-sm">{formatPercent(freePercent)}</p>
          </div>
        </div>
      </div>
    );
  };

interface DiskGraphProps {
    max: number;
    used: number;
  }
  

function mb_to_gb(data: number): String {
    let gb_data = data / Math.pow(1024,3);
    return gb_data.toFixed(2)
}

function extract_disk_name(data: string): String {
    let extract = data.split("/").pop();
    if (extract != null) {
        return extract;
    }else {
        return "";
    }
}