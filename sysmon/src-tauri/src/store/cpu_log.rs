use std::collections::VecDeque;



use crate::utility::cpu::ResCpuUsed;

pub struct CpuLog {
    pub records: VecDeque<ResCpuUsed>,
    pub max_records: usize
}

impl CpuLog {
    pub fn new(max_records: usize) -> Self {
        Self {
            records: VecDeque::with_capacity(max_records),
            max_records
        }
    }
    pub fn add_records(&mut self, record: ResCpuUsed) {
        if self.records.len() == self.max_records {
            self.records.pop_front(); // remove oldest
        }
        self.records.push_back(record);
    }

    pub fn latest(&self) -> Option<&ResCpuUsed> {
        self.records.back()
    }

    pub fn all(&self) -> &VecDeque<ResCpuUsed> {
        &self.records
    }
}