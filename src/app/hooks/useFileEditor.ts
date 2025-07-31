import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useFileEditor() {
    const [selectedFilePath, setSelectedFilePath] = useState<string>();
    const [originalContent, setOriginalContent] = useState<string>("");
    const [editedContentRaw, setEditedContentRaw] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const [history, setHistory] = useState<string[]>([""]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const maxHistory = 100;

    const hasUnsavedChanges = editedContentRaw !== originalContent;

    useEffect(() => {
        if (selectedFilePath) {
            invoke<string>('read_file', { filepath: selectedFilePath }).then(content => {
                setOriginalContent(content);
                setEditedContentRaw(content);
                setHistory([content]);
                setHistoryIndex(0);
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

    const setEditedContent = useCallback((newContent: string) => {
        setEditedContentRaw(newContent);

        if (history[historyIndex] !== newContent) {
            const newHistory = [...history.slice(0, historyIndex + 1), newContent];

            if (newHistory.length > maxHistory) newHistory.shift();

            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }, [history, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setEditedContentRaw(history[newIndex]);
        }
    }, [historyIndex, history]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setEditedContentRaw(history[newIndex]);
        }
    }, [historyIndex, history]);

    const saveFile = async () => {
        if (!selectedFilePath || !hasUnsavedChanges) return;

        setIsSaving(true);
        try {
            await invoke<void>('write_file', { filepath: selectedFilePath, content: editedContentRaw });
            setOriginalContent(editedContentRaw);
        } catch (error) {
            console.error('Error saving file:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        selectedFilePath,
        originalContent,
        editedContentRaw,
        setEditedContent,
        hasUnsavedChanges,
        isSaving,
        selectFile,
        saveFile,
        undo,
        redo
    };
}
