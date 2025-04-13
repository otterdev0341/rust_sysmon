use sysinfo::System;

use super::network::Network;

pub struct HostUtil{}

impl HostUtil {

    fn get_os_name() -> Option<String> {
       match System::name() {
        Some(data) => Some(data),
        None => None
       }
        
    }

    fn get_kernel_version() -> Option<String> {
        match System::kernel_version() {
            Some(data) => Some(data),
            None => None
           }
    }

    fn get_os_version() -> Option<String> {
        match System::os_version() {
            Some(data) => Some(data),
            None => None
           }
    }

    fn get_host_name() -> Option<String> {
        match System::host_name() {
            Some(data) => Some(data),
            None => None
           }
    }

    
    pub fn get_host_info() -> ResHostInfo {
        let mut result = ResHostInfo::default();
        result.host_name = match Self::get_host_name() {
            Some(data) => data,
            None => "".to_string()
        };
        result.os_name = match Self::get_os_name() {
            Some(data) => data,
            None => "".to_string()
        };
        result.os_version = match Self::get_os_version() {
            Some(data) => data,
            None => "".to_string()
        };
        result.kernel_version = match Self::get_kernel_version() {
            Some(data) => data,
            None => "".to_string()
        };
        let host_service = Network::get_host_ip_info();
        result.host_ipv4 = host_service.ipv4;
        result.host_ipv6 = host_service.ipv6;
        
        result
    }
}


#[derive(serde::Deserialize, Debug, serde::Serialize)]
pub struct ResHostInfo {
    pub host_name: String,
    pub os_name: String,
    pub os_version: String,
    pub kernel_version: String,
    pub host_ipv4: String,
    pub host_ipv6: String
}

impl Default for ResHostInfo {

    fn default() -> Self {
        Self {
            host_name: "".to_string(),
            os_name: "".to_string(),
            os_version: "".to_string(),
            kernel_version: "".to_string(),
            host_ipv4: "".to_string(),
            host_ipv6: "".to_string()
        }
    }
}