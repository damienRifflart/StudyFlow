import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useFileEditor() {
    const [selectedFilePath, setSelectedFilePath] = useState<string>();
    const [originalContent, setOriginalContent] = useState<string>("");
    const [editedContent, setEditedContent] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const hasUnsavedChanges = editedContent !== originalContent;

    useEffect(() => {
        if (selectedFilePath) {
        invoke<string>('read_file', { filepath: selectedFilePath }).then(content => {
            setOriginalContent(content);
            setEditedContent(content);
        });
        }
    }, [selectedFilePath]);

    const selectFile = (filePath: string) => {
        if (hasUnsavedChanges) {
            const confirm = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous continuer sans sauvegarder ?');
            if (!confirm) return;
        }
        setSelectedFilePath(filePath);
    };

    const saveFile = async () => {
        if (!selectedFilePath || !hasUnsavedChanges) return;
        
        setIsSaving(true);
        try {
            await invoke<void>('write_file', { filepath: selectedFilePath, content: editedContent });
            setOriginalContent(editedContent);
        } catch (error) {
            console.error('Error saving file:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        selectedFilePath,
        originalContent,
        editedContent,
        setEditedContent,
        hasUnsavedChanges,
        isSaving,
        selectFile,
        saveFile
    };
}