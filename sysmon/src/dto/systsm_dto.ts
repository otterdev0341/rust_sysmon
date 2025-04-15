export interface HostInfoDto {
    host_name: string;
    os_name: string;
    os_version: string;
    kernel_version: string;
    host_ipv4: string;
    host_ipv6: string;
}

export interface ResListDiskDataDto{
    size: number;
    phycical_drive: number;
    data: DiskDataDto[];
}

export interface DiskDataDto{
    name: string;
    disk_type: string;
    disk_system: string;
    disk_capacity_byte: number;
    disk_used_byte: number;
    disk_free_byte: number;
    mount_path: string;
}

export interface RamDataDto{
    ram_capacity: number;
    ram_used: number;
    ram_free: number;
    swap_used: number;
    swap_capacity: number;
    swap_free: number;
}


export interface ResCpuInfo {
    core: number;
    thread: number;
}
// pub struct CpuUsed{
//     pub cpu_core: u32,
//     pub cpu_used_percent: f32,
// }
export interface CpuUsedDto {
    cpu_core: number;        // Ensure cpu_core is included
    cpu_used_percent: number; // Use cpu_used_percent for the CPU usage percentage
}

export interface ResCpuUsed{
    data: CpuUsedDto[];
    length: number;
}

