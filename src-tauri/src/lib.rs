// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod nextcloud;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![nextcloud::my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}