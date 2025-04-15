// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{thread, time::Duration};

use sysmon_lib::{store::ram_log::RamLog, utility::ram::RamUtil};

fn main() {
    
    sysmon_lib::run()
}
