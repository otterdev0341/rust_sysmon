use std::fs::File;
use std::io::{BufRead, BufReader};

pub struct NetworkTrafficUtill{}

#[derive(Debug, serde::Serialize, Clone)]
pub struct InterfaceTraffic {
    pub name: String,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

#[derive(serde::Serialize,Debug, Clone)]
pub struct ResInterfaceTraffic {
    size: u32,
    data: Vec<InterfaceTraffic>
}

impl Default for InterfaceTraffic{
    fn default() -> Self {
        Self {
            name: "".to_string(),
            rx_bytes: 0,
            tx_bytes: 0
        }
    }
}

impl Default for ResInterfaceTraffic {
    fn default() -> Self {
        Self {
            data: vec![],
            size: 0
        }
    }
}

impl NetworkTrafficUtill {

    pub fn get_interface_traffic() -> ResInterfaceTraffic{
        let file = File::open("/proc/net/dev").expect("Failed to open /proc/net/dev");
        let reader = BufReader::new(file);
    
        let mut result = ResInterfaceTraffic::default();
    
        for line in reader.lines().skip(2) {
            if let Ok(line) = line {
                // Example line: "  eth0: 123456 0 0 0 0 0 0 0 789012 0 0 0 0 0 0 0"
                let parts: Vec<&str> = line.split(':').collect();
                if parts.len() == 2 {
                    let iface = parts[0].trim().to_string();
                    let data: Vec<&str> = parts[1].split_whitespace().collect();
                    if data.len() >= 9 {
                        let rx_bytes = data[0].parse::<u64>().unwrap_or(0);
                        let tx_bytes = data[8].parse::<u64>().unwrap_or(0);
    
                        result.data.push(InterfaceTraffic {
                            name: iface,
                            rx_bytes,
                            tx_bytes,
                        });

                    }
                    
                }
                result.size = result.data.len() as u32;
            }
        }
    
        result
    }
}
