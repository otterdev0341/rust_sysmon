use std::thread;
use sysinfo::System;

pub struct CpuUtill {}

#[derive(Debug, serde::Serialize, Clone)]
pub struct CpuUsed {
    pub cpu_core: u32,
    pub cpu_used_percent: f32,
}

#[derive(Debug, serde::Serialize, Clone)]
pub struct ResCpuUsed {
    pub data: Vec<CpuUsed>,
    pub length: u32,
}

#[derive(serde::Serialize, Clone)]
pub struct ResCpuInfo {
    pub core: u32,
    pub thread: u32,
}

impl Default for ResCpuInfo {
    fn default() -> Self {
        Self {
            core: 0,
            thread: 0,
        }
    }
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

    fn get_cpu_core() -> u32 {
        num_cpus::get_physical() as u32
    }

    pub fn get_cpu_used() -> ResCpuUsed {
        let mut result = ResCpuUsed::default();

        // Step 1: Refresh the system to get accurate data
        let mut sys = Self::refreshed_system();
        sys.refresh_cpu_usage(); // Initial refresh

        // Step 2: Sleep to allow the system to gather accurate CPU usage data
        thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL); // Short delay for accuracy
        sys.refresh_cpu_usage(); // Refresh again after the delay

        // Step 3: Get the CPU cores
        let cpus = sys.cpus();
        let num_cores = cpus.len() as u32;
        result.length = num_cores;

        // Step 4: Collect CPU usage data for each core
        for (i, cpu) in cpus.iter().enumerate() {
            let temp = CpuUsed {
                cpu_core: i as u32, // Ensure the index is the core id
                cpu_used_percent: cpu.cpu_usage(),
            };
            result.data.push(temp);
        }

        result
    }

    fn get_thread_count() -> u32 {
        // Using available_parallelism for thread count
        thread::available_parallelism().unwrap().get() as u32
    }

    pub fn get_cpu_info() -> ResCpuInfo {
        ResCpuInfo {
            core: Self::get_cpu_core(),
            thread: Self::get_thread_count(),
        }
    }
}
