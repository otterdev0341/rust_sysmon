import { invoke } from "@tauri-apps/api/core";
import { ResProcessDetailListDto } from "../dto/process_dto";

export class ProcessService {

    async get_process_info(): Promise<ResProcessDetailListDto> {
        let result: ResProcessDetailListDto = await invoke("get_process_info");
        return result
    }
    
}