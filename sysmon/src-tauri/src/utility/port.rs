use netstat2::{get_sockets_info, AddressFamilyFlags, ProtocolFlags, TcpState};

pub struct PortUtill{}

#[derive(Clone, serde::Serialize)]
pub struct ResPortList {
    size: u32,
    data: Vec<u32>
}

impl Default for ResPortList {
    fn default() -> Self {
        Self { 
            size: 0,
            data: vec![] 
        }
    }
}

impl PortUtill{
    pub fn get_port_list() -> ResPortList {

        let mut result = ResPortList::default();
        let af_flags = AddressFamilyFlags::IPV4 | AddressFamilyFlags::IPV6;
        let protocal_flag = ProtocolFlags::TCP | ProtocolFlags::UDP;

        match get_sockets_info(af_flags, protocal_flag) {
            Ok(sockets) => {
                for socket in sockets {
                    match socket.protocol_socket_info {
                        netstat2::ProtocolSocketInfo::Tcp(tcp_info) => {
                            if tcp_info.state == TcpState::Listen {
                                let target_port = tcp_info.local_port;
                                result.data.push(target_port as u32);
                            }
                        },
                        netstat2::ProtocolSocketInfo::Udp(udp_info) => {
                            let target_udp = udp_info.local_port;
                            result.data.push(target_udp as u32);
                        }
                    }
                }
                result.data.sort_unstable();
                result.data.dedup();
                result.size = result.data.len() as u32;
            },
            Err(err) => {
                eprintln!("Failed to get socket info: {}", err);
            }
        }

        
        result
    }

    
}


#[cfg(test)]
pub mod test_port {
    use super::PortUtill;

    
    #[test]
    fn test_port_check() {
        let result = PortUtill::get_port_list();
        for x in result.data.iter(){
            println!("{:?}",x);
        }
        println!("Total port is {:?}", result.size);
        
    }
}