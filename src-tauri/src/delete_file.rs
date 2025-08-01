use trash;

#[tauri::command]
pub fn delete_file(filepath: String) -> Result<(), String> {
    trash::delete(&filepath).map_err(|e| format!("Failed to delete file {}: {}", filepath, e))
}
