mod get_file;

use get_file::read_dir_recursive;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_dir_recursive])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
