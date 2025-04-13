import { invoke } from "@tauri-apps/api/core";
import { HostInfoDto, ResListDiskDataDto } from "../dto/systsm_dto";

export class SystemService {
    
    async get_system_info(): Promise<HostInfoDto>  {
        let result: HostInfoDto = await invoke("get_host_info")
        return result
    }

    async get_disks_info(): Promise<ResListDiskDataDto> {
        let result: ResListDiskDataDto = await invoke("get_disk_data_list");
        return result
    }
}

// async function get_system_info(): Promise<host_info> {
//     let result: host_info = await invoke("get_host_info")
//     return result
// }

