
export interface ResProcessDetailDto {
    pid: number;
    process_name: string;
    cpu_use: number;
    memory_used: number;
    disk_read: number;
    disk_write: number;
}

export interface ResProcessDetailListDto {
    size: number;
    data: ResProcessDetailDto[];
}