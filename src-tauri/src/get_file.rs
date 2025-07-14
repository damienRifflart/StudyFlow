use std::fs;

#[tauri::command]
pub fn read_file(filepath: String) -> String {
    let contents = fs::read_to_string(filepath)
        .expect("Should have been able to read the file");

    contents
}