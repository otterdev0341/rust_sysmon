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

    pub fn get_total_ram_gb() -> Option<f64> {  
        let sys = Self::refreshed_system();
        // convert
        let ram = ConvertHelper::byte_to_gb(sys.total_memory());
        match ram {
            Ok(data) => Some(data.round()),
            Err(_) => None
        }
    }

    pub fn get_used_ram_gb() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        // convert
        let used_ram = ConvertHelper::byte_to_gb(sys.used_memory());
        match used_ram {
            Ok(data) => Some(data),
            Err(_) => None
        }   
    }

    pub fn get_swap_size() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();

        let swap_size = ConvertHelper::byte_to_gb(sys.total_swap());
        match swap_size {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }

    pub fn get_swap_used() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        let swap_used = ConvertHelper::byte_to_gb(sys.used_swap());
        match swap_used {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }

    pub fn get_swap_free() -> Option<f64> {
        // initial
        let sys = Self::refreshed_system();
        let swap_free = ConvertHelper::byte_to_gb(sys.free_swap());
        match swap_free {
            Ok(data) => Some(data),
            Err(_) => None
        }
    }
}