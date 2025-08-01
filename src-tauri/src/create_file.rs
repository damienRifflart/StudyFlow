use std::fs;
use std::io::Write;
use std::path::PathBuf;

#[tauri::command]
pub fn create_file(folderpath: String, filename: String) -> Result<(), String> {
    let mut filepath = PathBuf::from(&folderpath);

    let filename = if filename.ends_with(".mdx") {
        filename
    } else {
        format!("{}.mdx", filename)
    };

    filepath.push(&filename);

    let mut file = fs::File::create(&filepath)
        .map_err(|e| format!("Failed to create file {}: {}", filepath.display(), e))?;
        
    file.write_all(b"# Nouveau fichier MDX\n")
        .map_err(|e| format!("Failed to write to file {}: {}", filepath.display(), e))?;

    Ok(())
}
