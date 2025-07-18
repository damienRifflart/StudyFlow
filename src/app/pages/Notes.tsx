import { useFileTree } from '@/app/hooks/useFileTree';
import { useFileEditor } from '@/app/hooks/useFileEditor';
import { FileTree } from '@/components/FileTree';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { FileText } from "lucide-react";

export default function Notes() {
    const rootPath = "/home/damienrifflart/Documents/Notes";
    const { tree, closedFolders, toggleFolder } = useFileTree(rootPath);
    const { selectedFilePath, originalContent, editedContent, setEditedContent, hasUnsavedChanges, isSaving, selectFile, saveFile } = useFileEditor();

    const isMarkdownFile = selectedFilePath?.match(/\.mdx?$/i);

    return (
        <div className="w-full bg-background flex">
            <aside className="w-60 border-r border-border overflow-y-auto text-white p-4">
                <FileTree
                    tree={tree}
                    closedFolders={closedFolders}
                    onToggleFolder={toggleFolder}
                    onSelectFile={selectFile}
                    rootPath={rootPath}
                />
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col">
                {originalContent && isMarkdownFile ? (
                    <MarkdownEditor
                        content={editedContent}
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