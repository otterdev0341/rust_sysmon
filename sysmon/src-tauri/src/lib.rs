use std::{sync::{Arc, Mutex}, thread, time::Duration};

use store::ram_log::RamLog;
use utility::{disk::{DiskUtill, ResListDiskData}, host::{ HostUtil, ResHostInfo}, ram::{RamUtil, ResRamInfo}};


pub mod utility;
pub mod store;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Wrap RamLog in Arc<Mutex<...>> to share across threads
    let ram_log = Arc::new(Mutex::new(RamLog::new(60)));

    // Clone for background loop
    let ram_log_clone = Arc::clone(&ram_log);

    thread::spawn(move || {
        loop {
            let ram_data = RamUtil::get_ram_info();
            if let Ok(mut log) = ram_log_clone.lock() {
                log.add_records(ram_data);
            }
            thread::sleep(Duration::from_secs(1));
        }
    });

    tauri::Builder::default()
        .manage(ram_log)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            test_clg,
            get_host_info,
            get_disk_data_list,
            get_ram_info
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

