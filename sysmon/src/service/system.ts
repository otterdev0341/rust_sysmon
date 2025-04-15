import { invoke } from "@tauri-apps/api/core";
import { HostInfoDto, RamDataDto, ResCpuInfo, ResCpuUsed, ResListDiskDataDto } from "../dto/systsm_dto";

export class SystemService {
    
    async get_system_info(): Promise<HostInfoDto>  {
        let result: HostInfoDto = await invoke("get_host_info")
        return result
    }

    async get_disks_info(): Promise<ResListDiskDataDto> {
        let result: ResListDiskDataDto = await invoke("get_disk_data_list");
        return result
    }

    async get_ram_info(): Promise<RamDataDto> {
        let result: RamDataDto = await invoke("get_ram_info");
        return result
    }

    async get_cpu_info(): Promise<ResCpuInfo> {
        let result: ResCpuInfo = await invoke("get_cpu_info");
        return result
    }

    async get_cpu_used(): Promise<ResCpuUsed> {
        let result: ResCpuUsed = await invoke("get_cpu_used");
        return result
    }
}

// async function get_system_info(): Promise<host_info> {
//     let result: host_info = await invoke("get_host_info")
//     return result
// }

