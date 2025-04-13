use std::ffi::OsStr;

use thiserror::Error;

pub struct ConvertHelper{}

#[derive(Error, Debug)]

pub enum ByteConverterError {
    #[error("can't perform the operation with zero")]
    ZeroDividedError,
}

#[derive(Error, Debug)]
pub enum OsStringTranformError{
    #[error("can't convert this to string")]
    FailToConvertToString
}

impl ConvertHelper {
    pub fn byte_to_gb(data: u64) -> Result<f64, ByteConverterError> {
        if data > 0 {
            let result = (data as f64) / (1024.0 * 1024.0 * 1024.0);
            Ok(result)
        } else {
            Err(ByteConverterError::ZeroDividedError)
        }       
    }

    pub fn os_str_to_string(data: &OsStr) -> Result<String, OsStringTranformError> {
        let extract_data = match data.to_str() {
            Some(data) => Ok(data.to_string()),
            None => Err(OsStringTranformError::FailToConvertToString),
        };
        extract_data
    }
}