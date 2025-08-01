import { useFileTree } from '@/app/hooks/useFileTree';
import { useFileEditor } from '@/app/hooks/useFileEditor';
import { FileTree } from '@/components/FileTree';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { FileText } from "lucide-react";
import { useEffect } from 'react';

export default function Notes() {
    const rootPath = "/home/damienrifflart/Documents/Notes";
    const { tree, closedFolders, toggleFolder, deleteFile, createFile } = useFileTree(rootPath);
    const { selectedFilePath, originalContent, editedContentRaw, setEditedContent, hasUnsavedChanges, isSaving, selectFile, saveFile, undo, redo } = useFileEditor();

    const isMarkdownFile = selectedFilePath?.match(/\.mdx?$/i);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (hasUnsavedChanges) {
                    saveFile();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, saveFile, undo, redo]);

    return (
        <div className="w-full bg-background flex">
            <aside className="w-60 border-r border-border overflow-y-auto text-white p-4">
                <FileTree
                    tree={tree}
                    closedFolders={closedFolders}
                    onToggleFolder={toggleFolder}
                    onDeleteFile={deleteFile}
                    onSelectFile={selectFile}
                    onCreateFile={createFile}
                />
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col">
                {originalContent && isMarkdownFile ? (
                    <MarkdownEditor
                        content={editedContentRaw}
                        onContentChange={setEditedContent}
                        hasUnsavedChanges={hasUnsavedChanges}
                        isSaving={isSaving}
                        onSave={saveFile}
                    />
                ) : originalContent ? (
                    <div className="flex-1 overflow-y-auto p-5 text-foreground">
                        <p className="text-foreground whitespace-pre-wrap max-w-3xl">{originalContent}</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-foreground2 gap-2">
                        <FileText size={50} />
                        <span className="text-lg">Aucune note sélectionnée.</span>
                        <span className="text-lg">Sélectionnez une note dans l'arborescence.</span>
                    </div>
                )}
            </main>
        </div>
    );
}