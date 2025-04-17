import { invoke } from "@tauri-apps/api/core";
import { ResInterfaceTrafficDto, ResPortListDto } from "../dto/network.dto";

export class NetworkService {

    async get_port_detail(): Promise<ResPortListDto> {
        let result: ResPortListDto = await invoke("get_allow_port_list");
        return result
    }

    async get_network_traffic(): Promise<ResInterfaceTrafficDto> {
        let result: ResInterfaceTrafficDto = await invoke("get_network_traffic");
        return result
    }
}