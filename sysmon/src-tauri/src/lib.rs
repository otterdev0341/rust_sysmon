use utility::{disk::{DiskUtill, ResListDiskData}, host::{ HostUtil, ResHostInfo}, ram::{RamUtil, ResRamInfo}};


pub mod utility;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
fn get_ram_info() -> ResRamInfo {
    let result = RamUtil::get_ram_info();
    result
}