use std::{thread, time::Duration, vec};


use sysinfo::System;

pub struct CpuUtill{}

#[derive(Debug)]
pub struct CpuUsed{
    pub cpu_core: u32,
    pub cpu_used_percent: f32,
}

#[derive(Debug)]
pub struct ResCpuUsed{
    pub data: Vec<CpuUsed>,
    pub length: u32
}


impl Default for ResCpuUsed {
    fn default() -> Self {
        Self {
            data: vec![],
            length: 0,
        }
    }
}

impl CpuUtill {
    // initial function to avoid duplicate code
    fn refreshed_system() -> System {
        let mut sys = System::new_all();
        sys.refresh_all();
        sys
    }

    pub fn get_cpu_core() -> u32 {
        let core = num_cpus::get_physical() as u32 ;
        core
    }

    pub fn get_cpu_used() -> ResCpuUsed{

        let mut result = ResCpuUsed::default();
        
        result.length = Self::get_cpu_core();
        
        for i in 0..result.length as usize {
            let mut sys = Self::refreshed_system();
            sys.refresh_cpu_usage(); // Initial refresh
            thread::sleep(Duration::from_millis(900)); // Add a small delay
            sys.refresh_cpu_usage(); // Refresh again after the delay
            let cpus = sys.cpus();
            let cpu = &cpus[i];
            
            let temp = CpuUsed {
                cpu_core: i as u32,
                cpu_used_percent: cpu.cpu_usage(),
            };
            // println!("cpu core {} : {:.2}", i, cpu.cpu_usage());
            result.data.push(temp);
        }
        result
    }

    pub fn get_thread_count() -> u32 {
        let thread_count = thread::available_parallelism().unwrap().get();
        thread_count as u32
    }
}