use std::fs;

#[tauri::command]
pub fn read_file(filepath: String) -> Result<String, String> {
    fs::read_to_string(&filepath).map_err(|e| format!("Failed to read file {}: {}", filepath, e))
}
