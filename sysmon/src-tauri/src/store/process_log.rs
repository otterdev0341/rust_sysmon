use std::collections::VecDeque;

use crate::utility::process::ResProcessDetailList;



pub struct ProcessLog {
    pub records: VecDeque<ResProcessDetailList>,
    pub max_records: usize
}

impl ProcessLog {

    pub fn new(max_records: usize) -> Self {
        Self {
            records: VecDeque::with_capacity(max_records),
            max_records
        }
    }

    pub fn add_records(&mut self, record: ResProcessDetailList) {
        if self.records.len() == self.max_records {
            self.records.pop_front();
        }
        self.records.push_back(record);
    }

    pub fn latest(&self) -> Option<&ResProcessDetailList> {
        self.records.back()
    }

    pub fn all(&self) -> &VecDeque<ResProcessDetailList> {
        &self.records
    }
}