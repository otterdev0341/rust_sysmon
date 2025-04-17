use std::collections::VecDeque;

use crate::utility::network_traffic::ResInterfaceTraffic;

pub struct NetworkTrafficLog {
    pub records: VecDeque<ResInterfaceTraffic>,
    pub max_records: usize
}

impl NetworkTrafficLog {
    pub fn new(max_records: usize) -> Self {
        Self {
            records: VecDeque::with_capacity(max_records),
            max_records
        }
    }

    pub fn add_records(&mut self, record: ResInterfaceTraffic) {
        if self.records.len() == self.max_records {
            self.records.pop_front();
        }
        self.records.push_back(record);
    }

    pub fn latest(&self) -> Option<&ResInterfaceTraffic> {
        self.records.back()
    }

    pub fn all(&self) -> &VecDeque<ResInterfaceTraffic> {
        &self.records
    }
}