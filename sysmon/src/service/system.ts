import { invoke } from "@tauri-apps/api/core";
import { host_info } from "../dto/systsm_dto";

export class SystemService {
    
    async get_system_info(): Promise<host_info>  {
        let result: host_info = await invoke("get_host_info")
        return result
    }
}

// async function get_system_info(): Promise<host_info> {
//     let result: host_info = await invoke("get_host_info")
//     return result
// }

