use std::fs;

#[tauri::command]
pub fn write_file(filepath: String, content: String) -> Result<(), String> {
    fs::write(&filepath, content)
        .map_err(|e| format!("Failed to write file {}: {}", filepath, e))?;
    
    Ok(())
}