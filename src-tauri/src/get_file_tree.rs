use serde::Serialize;
use std::fs; // pour lire les fichier
use std::path::PathBuf; // pour envoyer en json

#[derive(Serialize)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Option<Vec<FileNode>>,
}

#[tauri::command]
pub fn read_tree(folderpath: String) -> Result<FileNode, String> {
    fn walk(path: &PathBuf) -> std::io::Result<Option<FileNode>> {
        let metadata = fs::metadata(path)?;
        let is_dir = metadata.is_dir();

        let name = path
            .file_name()
            .map(|s| s.to_string_lossy().into_owned()) // convertis de OsStr vers String
            .unwrap_or_else(|| String::from("")); // si ça échoue, on met ""

        if is_dir {
            let mut entries = Vec::new();
            for entry in fs::read_dir(path)? {
                let entry = entry?;
                if let Some(child_node) = walk(&entry.path())? {
                    entries.push(child_node);
                }
            }

            // inclure le dossier que s'il a des enfants
            if entries.is_empty() {
                return Ok(None);
            }

            Ok(Some(FileNode {
                name,
                path: path.to_string_lossy().to_string(),
                is_dir: true,
                children: Some(entries),
            }))
        } else {
            // inclure uniquement les fichiers '.md' ou '.mdx'
            if path
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext == "md" || ext == "mdx")
                .unwrap_or(false)
            {
                Ok(Some(FileNode {
                    name,
                    path: path.to_string_lossy().to_string(),
                    is_dir: false,
                    children: None,
                }))
            } else {
                Ok(None)
            }
        }
    }

    let path = PathBuf::from(folderpath);
    walk(&path).map_err(|e| e.to_string()).and_then(|opt| {
        opt.ok_or_else(|| "Le dossier ne contient aucun fichier .md ou .mdx".to_string())
    })
}
