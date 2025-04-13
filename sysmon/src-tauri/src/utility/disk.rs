use sysinfo::Disks;

use super::convert_helper::ConvertHelper;

pub struct DiskUtill{}

impl DiskUtill{

       // initial function to avoid duplicate code
    fn refreshed_disk() -> Disks {
        let disks = Disks::new_with_refreshed_list();
        disks
    }

    pub fn get_disk_amount() -> u32 {
        let disks = Self::refreshed_disk();
        let amount = disks.len() as u32;
        amount
    }

    pub fn get_phycical_disks_amount() -> u32 {
        let mut count: u32 = 0;
        let disks = Self::refreshed_disk();
        for disk in &disks {
            let temp = disk.kind().to_string();
            if temp == "HDD".to_owned() || temp == "SSD".to_owned() {
                count += 1;
            }
        }
        count
    }


    pub fn get_phycical_disk_list() -> Vec<String> {
        let disks = Self::refreshed_disk();
        let mut result = Vec::<String>::new();
        for data in &disks {
            let disk_type = data.kind().to_string();
            if disk_type == "SSD".to_owned() || disk_type == "HDD".to_owned() {
                let temp_name = ConvertHelper::os_str_to_string(data.name()).unwrap_or_default();
                result.push(temp_name);
            }     
        }
        result
    }

    pub fn get_disk_data(target: u32) -> DiskData {
        let disks = Self::refreshed_disk();
        let mut result = DiskData::default();
        for (index, data) in disks.iter().enumerate() {
            if index as u32 == target {
                let name = data.name().to_owned();
                let disk_type = data.kind().to_string();
                let disk_system = data.file_system().to_owned();
                let disk_capacity = data.total_space();
                let disk_free = data.available_space();
                let disk_used = disk_capacity - disk_free;
                let mount_point = match data.mount_point().to_str() {
                    Some(data) => data.to_string(),
                    None => "not available".to_string(),
                };
                // add extract data into struct to return
                result.name = ConvertHelper::os_str_to_string(&name).unwrap_or_default();
                result.disk_type = disk_type;
                result.disk_system = ConvertHelper::os_str_to_string(&disk_system).unwrap_or_default();
                result.disk_capacity_byte = disk_capacity;
                result.disk_used_byte = disk_used;
                result.disk_free_byte = disk_free;
                result.mount_path = mount_point;

            }
        }
        result
    }

    pub fn get_disk_data_list() -> ResListDiskData {
        let disks = Self::refreshed_disk();
        let mut result_data = ResListDiskData::default();
        result_data.size = disks.len() as u32;
        for (index, _data) in disks.iter().enumerate() {
            let temp_record = Self::get_disk_data(index as u32);
            result_data.data.push(temp_record);
        }
        result_data
    }

}



#[derive(Debug)]
pub struct DiskData {
    pub name: String,
    pub disk_type: String,
    pub disk_system: String,
    pub disk_capacity_byte: u64,
    pub disk_used_byte: u64,
    pub disk_free_byte: u64,
    pub mount_path: String
}

impl Default for DiskData {
    fn default() -> Self {
        Self {
            name: "".to_owned(),
            disk_type: "".to_owned(),
            disk_system: "".to_owned(),
            disk_capacity_byte: 0,
            disk_used_byte: 0,
            disk_free_byte: 0,
            mount_path: "".to_owned()
        }
    }
}

#[derive(Debug)]
pub struct ResListDiskData {
    pub size: u32,
    pub data: Vec<DiskData>
}

impl Default for ResListDiskData {
    fn default() -> Self {
        Self {
            size: 0,
            data: vec![]
        }
    }
}