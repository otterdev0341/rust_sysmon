use std::collections::VecDeque;

use crate::utility::ram::ResRamInfo;


pub struct RamLog {
    pub records: VecDeque<ResRamInfo>,
    pub max_records: usize,
}

impl RamLog {
    pub fn new(max_records: usize) -> Self {
        Self {
            records: VecDeque::with_capacity(max_records),
            max_records
        }
    }

    pub fn add_records(&mut self, record: ResRamInfo) {
        if self.records.len() == self.max_records {
            self.records.pop_front(); // remove oldest
        }
        self.records.push_back(record);
    }

    pub fn latest(&self) -> Option<&ResRamInfo> {
        self.records.back()
    }

    pub fn all(&self) -> &VecDeque<ResRamInfo> {
        &self.records
    }
}