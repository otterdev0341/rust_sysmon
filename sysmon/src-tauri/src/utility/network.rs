use local_ip_address::linux::{local_ip, local_ipv6};


pub struct Network{}

impl Network {
    fn get_host_ipv4() -> Option<String>  {
        let my_ipv4 = local_ip();
        let extract_ipv4 = match my_ipv4 {
            Ok(data) => Some(data.to_string()),
            Err(_) => None,
        };
        extract_ipv4
    }

    fn get_host_ipv6() -> Option<String> {
        let my_ipv6 = local_ipv6();
        let extract_ipv6 = match my_ipv6 {
            Ok(data) => Some(data.to_string()),
            Err(_) => None
        };
        extract_ipv6
    }
    
    pub fn get_host_ip_info() -> ResIpInfo {
        let ipv4 = match Self::get_host_ipv4() {
            Some(data) => data,
            None => "".to_string()
        };
        let ipv6 = match Self::get_host_ipv6() {
            Some(data) => data,
            None => "".to_string()
        };
        let result = ResIpInfo{ipv4 : ipv4, ipv6: ipv6};
        result
    }
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct ResIpInfo {
    pub ipv4: String,
    pub ipv6: String,
}

impl Default for ResIpInfo {
    fn default() -> Self {
        Self {
            ipv4: "".to_string(),
            ipv6: "".to_string()
        }
    }
}