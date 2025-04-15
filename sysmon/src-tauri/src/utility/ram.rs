use sysinfo::System;

use super::convert_helper::ConvertHelper;

pub struct RamUtil{}

impl RamUtil {

    // initial function to avoid duplicate code
    fn refreshed_system() -> System {
        let mut sys = System::new_all();
        sys.refresh_all();
        sys
    }

    fn get_total_ram_gb() -> Option<f64> {  
        let mut sys = System::new_all();
        sys.refresh_memory();
        // convert
        let ram = ConvertHelper::byte_to_gb(sys.total_memory());
        match ram {
            Ok(data) => Some(data.round()),
            Err(_) => None
        }
    }

    fn get_used_ram_gb() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        // convert
        let used_ram = ConvertHelper::byte_to_gb(sys.used_memory());
        match used_ram {
            Ok(data) => Some(data),
            Err(_) => None
        }   
    }

    fn get_free_ram_gb() -> Option<f64> {
    
        // get max ram value
        let max_ram = match Self::get_total_ram_gb() {
            Some(data) => data,
            None => 0.0
        };
        // get used ram
        let used_ram = match Self::get_used_ram_gb() {
            Some(data) => data,
            None => 0.0
        };
        let result = max_ram - used_ram;
        if result > 0.0 {
            Some(result)
        } else {
            None
        }

    }

    fn get_swap_size() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();

        let swap_size = ConvertHelper::byte_to_gb(sys.total_swap());
        match swap_size {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }

    fn get_swap_used() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        let swap_used = ConvertHelper::byte_to_gb(sys.used_swap());
        match swap_used {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }

    

    fn get_swap_free() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        let swap_free = ConvertHelper::byte_to_gb(sys.free_swap());
        match swap_free {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }

    pub fn get_ram_info() -> ResRamInfo {
        let result = ResRamInfo {
            ram_capacity : Self::get_total_ram_gb().unwrap_or_default(),
            ram_free: Self::get_free_ram_gb().unwrap_or_default(),
            ram_used: Self::get_used_ram_gb().unwrap_or_default(),
            swap_capacity: Self::get_swap_size().unwrap_or_default(),
            swap_free: Self::get_swap_free().unwrap_or_default(),
            swap_used: Self::get_swap_used().unwrap_or_default()

        };
        result
    }
}


#[derive(serde::Serialize, Clone, serde::Deserialize)]
pub struct ResRamInfo{
    pub ram_capacity: f64,
    pub ram_used: f64,
    pub ram_free: f64,
    pub swap_capacity: f64,
    pub swap_used: f64,
    pub swap_free: f64
}

impl Default for ResRamInfo {
    fn default() -> Self {
        Self {
            ram_capacity: 0.0,
            ram_used: 0.0,
            ram_free: 0.0,
            swap_capacity: 0.0,
            swap_used: 0.0,
            swap_free: 0.0
        }
    }
}

