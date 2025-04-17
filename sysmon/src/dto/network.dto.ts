export interface InterfaceTrafficDto {
    name: String;
    rx_bytes: number;
    tx_bytes: number;
}

export interface ResInterfaceTrafficDto {
    size: number;
    data: InterfaceTrafficDto[]
}

export interface ResPortListDto {
    size: number;
    data: number[];
}