use sysinfo::{Pid, System};
use thiserror::Error;
use crate::utility::convert_helper::ConvertHelper;
use super::cpu::CpuUtill;

pub struct ProcessUtill{}

#[derive(Debug, Error)]
pub enum ProcessKillError {
    #[error("Fail to kill this process")]
    FailToKill,
    #[error("PID not found")]
    FailToFindPid
}

#[derive(Debug, Error)]
pub enum PidOperationError {
    #[error("PID not found")]
    PidNotFound
}

impl ProcessUtill {
    
    fn refreshed_system() -> System {
        let mut sys = System::new_all();
        sys.refresh_all();
        sys
    }

    pub fn get_process_running_count() -> usize {
        let sys = Self::refreshed_system();
        let runnint_process = sys.processes().len();
        runnint_process
    }

    pub fn get_all_process_detail() -> ResProcessDetailList {
        let sys = Self::refreshed_system();
        
        let mut result = ResProcessDetailList::default();
        for (pid, _process) in sys.processes() {
            let temp_result = Self::get_process_detail_by_pid(pid.as_u32());
            result.data.push(temp_result);
        }
        result.size = result.data.len() as u32;
        return result

    }

    pub fn get_process_detail_by_pid(target_pid: u32) -> ProcessDetail {
        // inject sys
        let sys = Self::refreshed_system();
        let mut pid: Option<&Pid> = None;
      
        let mut result = ProcessDetail::default();
        // convert target_pid to PID
        for (inner_pid, _process) in sys.processes() {
            if inner_pid.as_u32() == target_pid {
                pid = Some(inner_pid);
                break;
            }
        }
        // use PID to find process
        if let Some(valid_pid) = pid {
            let extract_pid = valid_pid.as_u32();
            let process = match sys.process(*valid_pid) {
                Some(data) => data,
                None => {
                    println!("No process found with PID: {}", extract_pid);
                    return result;
                }
            };
            // if found process extract data and return result
            result.pid = extract_pid;
            result.process_name = ConvertHelper::os_str_to_string(process.name()).unwrap_or_default();
            result.cpu_used = process.cpu_usage();
            result.memory_used = process.memory();
            result.disk_read = process.disk_usage().read_bytes;
            result.disk_write = process.disk_usage().written_bytes;
            
            return result
            
        } else {
            return result
        }
    }

    pub fn filter_process(context: String) -> ResProcessDetailList {
        // conter normally like app name ex: chrome, firefox
        let filtered_data = Self::get_all_process_detail().filter_process(context);
        filtered_data
    }

    pub fn kill_process_by_pid(pid: u32) -> Result<(),ProcessKillError> {
        let sys = Self::refreshed_system();
        let process_id = Self::u32_to_pid(pid);

        match process_id {
            Ok(target_id) => {
                match sys.process(target_id) {
                    Some(target_process) => {
                        let operation_result = target_process.kill();
                        if operation_result == true {
                            Ok(())
                        } else {
                            Err(ProcessKillError::FailToKill)
                        }
                    },
                    None => {
                        return Err(ProcessKillError::FailToFindPid);
                    }
                }
            },
            Err(_) => {
                return Err(ProcessKillError::FailToFindPid)
            }
        }
    }

    pub fn u32_to_pid(target_pid: u32) -> Result<Pid, PidOperationError> {
        let sys = Self::refreshed_system();
        let mut pid: Option<&Pid> = None;
        for (inner_pid, _process) in sys.processes() {
            if inner_pid.as_u32() == target_pid {
                pid = Some(inner_pid);
                break;
            }
        }
       match pid {
        Some(data) => Ok(*data),
        None => Err(PidOperationError::PidNotFound)
       }
        
    }

}


#[derive(Debug, Clone)]
pub struct ProcessDetail {
    pub pid: u32,
    pub process_name: String,
    pub cpu_used: f32,
    pub memory_used: u64,
    pub disk_read: u64,
    pub disk_write: u64, 
}

impl ProcessDetail {
    fn get_percent_cpu_used(&self) -> f32 {
        let cpu_core = CpuUtill::get_cpu_core() as f32;
        let percent = self.cpu_used / cpu_core;
        percent

    }
}

impl Default for ProcessDetail {
    fn default() -> Self {
        Self {
            pid: 0,
            process_name: "".to_string(),
            cpu_used: 0.0,
            memory_used: 0,
            disk_read: 0,
            disk_write: 0,
        }
    }
}


#[derive(Debug)]
pub struct ResProcessDetailList {
    size: u32,
    data: Vec<ProcessDetail>
}

impl Default for ResProcessDetailList {
    fn default() -> Self {
        Self {
            size: 0,
            data: vec![]
        }
    }
}

impl ResProcessDetailList {
    pub fn filter_process(&self, context: String) -> ResProcessDetailList {
        let filtered_data: Vec<ProcessDetail> = self
            .sort_by_cpu_used()
            .data
            .iter()
            .filter(|proc| proc.process_name.contains(&context))
            .cloned()
            .collect();

        ResProcessDetailList {
            size: filtered_data.len() as u32,
            data: filtered_data,
        }
    }

    pub fn sort_by_cpu_used(&self) -> ResProcessDetailList {
        let mut sorted_data = self.data.clone();
        sorted_data.sort_by(|a, b| b.get_percent_cpu_used().partial_cmp(&a.get_percent_cpu_used()).unwrap_or(std::cmp::Ordering::Equal));
        ResProcessDetailList {
            size: sorted_data.len() as u32,
            data: sorted_data,
        }
    }
}

