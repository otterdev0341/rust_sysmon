use std::{sync::{Arc, Mutex}, thread, time::Duration};

use store::{cpu_log::CpuLog, network_traffic_log::NetworkTrafficLog, process_log::ProcessLog, ram_log::RamLog};
use utility::{cpu::{CpuUtill, ResCpuInfo, ResCpuUsed}, disk::{DiskUtill, ResListDiskData}, host::{ HostUtil, ResHostInfo}, network_traffic::{NetworkTrafficUtill, ResInterfaceTraffic}, port::{PortUtill, ResPortList}, process::{ProcessUtill, ResProcessDetailList}, ram::{RamUtil, ResRamInfo}};


pub mod utility;
pub mod store;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Wrap RamLog in Arc<Mutex<...>> to share across threads
    let ram_log = Arc::new(Mutex::new(RamLog::new(60)));
    let cpu_log = Arc::new(Mutex::new(CpuLog::new(100)));
    let cpu_info = Arc::new(Mutex::new(CpuUtill::get_cpu_info()));
    let process_info = Arc::new(Mutex::new(ProcessLog::new(3)));
    let network_traffic_log = Arc::new(Mutex::new(NetworkTrafficLog::new(100)));
    // Clone for background loop

    let ram_log_clone = Arc::clone(&ram_log);
    let cpu_log_clone = Arc::clone(&cpu_log);
    let process_log_clone = Arc::clone(&process_info);
    let network_traffic_log_clone = Arc::clone(&network_traffic_log);
    thread::spawn(move || {
        loop {
            let ram_data = RamUtil::get_ram_info();
            if let Ok(mut log) = ram_log_clone.lock() {
                log.add_records(ram_data);
            }
            thread::sleep(Duration::from_secs(1));
        }
    });

    thread::spawn(move || {
        loop {
            let cpu_data = CpuUtill::get_cpu_used();
            if let Ok(mut log) = cpu_log_clone.lock() {
                log.add_records(cpu_data);
            }
            thread::sleep(Duration::from_secs(2));
        }
    });
    
    thread::spawn(move || {
        let process_data = ProcessUtill::get_all_process_detail();
        if let Ok(mut process) = process_log_clone.lock() {
            process.add_records(process_data);
        }
    });

    thread::spawn(move || {
        loop {
            let traffic_data = NetworkTrafficUtill::get_interface_traffic();
            if let Ok(mut log) = network_traffic_log_clone.lock() {
                log.add_records(traffic_data);
            }
            thread::sleep(Duration::from_secs(2));
        }
    });

    

    tauri::Builder::default()
        .manage(ram_log)
        .manage(cpu_log)
        .manage(cpu_info)
        .manage(process_info)
        .manage(network_traffic_log)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            test_clg,
            get_host_info,
            get_disk_data_list,
            get_ram_info,
            get_cpu_used,
            get_cpu_info,
            get_process_info,
            kill_process_by_id,
            get_allow_port_list,
            get_network_traffic
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command] 
fn test_clg() {
    println!("Hello from console log");
}

#[tauri::command]
fn get_host_info() -> ResHostInfo {
    let result = HostUtil::get_host_info();
    result
}

#[tauri::command]
fn get_disk_data_list() -> ResListDiskData {
    let result = DiskUtill::get_disk_data_list();
    result
}

#[tauri::command]
fn get_ram_info(ram_data: tauri::State<'_, Arc<Mutex<RamLog>>>) -> ResRamInfo {
    let guard = ram_data.lock().unwrap();
    match guard.latest() {
        Some(data) => data.clone(),
        None => ResRamInfo::default(), // or return an Option if you want
    }
}

#[tauri::command]
fn get_cpu_used(cpu_data: tauri::State<'_, Arc<Mutex<CpuLog>>>) -> ResCpuUsed {
    let guard = cpu_data.lock().unwrap();
    match guard.latest() {
        Some(data) => data.clone(),
        None => ResCpuUsed::default()
    }
}

#[tauri::command]
fn get_cpu_info(cpu_info: tauri::State<'_, Arc<Mutex<ResCpuInfo>>>) -> ResCpuInfo {
    let guard = cpu_info.lock().unwrap();
    let extract = guard.clone();
    extract

}


#[tauri::command]
fn get_process_info(process_info: tauri::State<'_, Arc<Mutex<ProcessLog>>>) -> ResProcessDetailList {
    let guard = process_info.lock().unwrap();
    match guard.latest() {
        Some(data) => {
            // println!("{:?}", data);
            return data.clone();
        },
        None => ResProcessDetailList::default()
    }
}


#[tauri::command]
fn kill_process_by_id(process_id: u32) -> bool {
    let kill_operation = ProcessUtill::kill_process_by_pid(process_id);
    let kill_result = match kill_operation {
        Ok(_) => true,
        Err(_) => false
    };
    kill_result
}

#[tauri::command]
fn get_allow_port_list() -> ResPortList {
    let result = PortUtill::get_port_list();
    result
}

#[tauri::command]
fn get_network_traffic(data: tauri::State<'_, Arc<Mutex<NetworkTrafficLog>>>) -> ResInterfaceTraffic {
    let guard = data.lock().unwrap();
    match guard.latest() {
        Some(data) => {
            return data.clone()
        },
        None => ResInterfaceTraffic::default()
    }
}