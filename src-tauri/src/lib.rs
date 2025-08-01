mod create_file;
mod delete_file;
mod get_file;
mod get_file_tree;
mod write_file;

use create_file::create_file;
use delete_file::delete_file;
use get_file::read_file;
use get_file_tree::read_tree;
use write_file::write_file;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            read_tree,
            read_file,
            write_file,
            delete_file,
            create_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
