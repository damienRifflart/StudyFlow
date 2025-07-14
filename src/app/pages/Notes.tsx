import { ChevronDown, ChevronUp, FileText, Edit, Eye, Save, BarChart3 } from "lucide-react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from "react";
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import Chart from '../../components/Chart';

export type FileNode = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
};

type TabMode = 'edit' | 'preview';

export default function Notes() {
    const [tree, setTree] = useState<FileNode | null>(null);
    const rootPath = "/home/damienrifflart/Documents/Notes";
    const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());
    const [selectedFilePath, setSelectedFilePath] = useState<string>();
    const [selectedFile, setSelectedFile] = useState<string>();
    const [editedContent, setEditedContent] = useState<string>("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [currentTab, setCurrentTab] = useState<TabMode>('preview');
    const [CompiledMDX, setCompiledMDX] = useState<React.ComponentType<any> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    async function loadFileTree(folder_path: string): Promise<FileNode> {
        return await invoke<FileNode>('read_tree', { folderpath: folder_path });
    }

    async function loadFile(filePath: string): Promise<string> {
        return await invoke<string>('read_file', { filepath: filePath });
    }

    async function saveFile(filePath: string, content: string): Promise<void> {
        return await invoke<void>('write_file', { filepath: filePath, content });
    }

    useEffect(() => {
        loadFileTree(rootPath).then(setTree);
    }, []);

    useEffect(() => {
        if (selectedFilePath) {
            loadFile(selectedFilePath).then(content => {
                setSelectedFile(content);
                setEditedContent(content);
                setHasUnsavedChanges(false);
                setCurrentTab('preview');
            });
        }
    }, [selectedFilePath]);

    useEffect(() => {
        if (!selectedFile) {
            setCompiledMDX(null);
            return;
        }
        
        (async () => {
            try {
                const { default: Content } = await evaluate(editedContent, runtime);
                setCompiledMDX(() => Content);
            } catch (error) {
                console.error('MDX compilation error:', error);
                setCompiledMDX(() => () => <div className="text-red-500">Error compiling MDX</div>);
            }
        })();
    }, [selectedFile, editedContent, currentTab]);

    function isAtRoot(filePath: string): boolean {
        const relative = filePath.replace(rootPath, '').replace(/^\//, '');
        return !relative.includes('/') || relative === '';
    }

    function toggleFolder(path: string) {
        setClosedFolders(prev => {
            const next = new Set(prev);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
        });
    }

    function handleContentChange(value: string) {
        setEditedContent(value);
        setHasUnsavedChanges(value !== selectedFile);
    }

    function insertChart() {
        const chartTemplate = `<Chart
    title="Graphique des ventes"
    type="bar"
    width={400}
    height={300}
    data={{
        labels: ['Jan', 'Feb', 'Mar', 'Avr'],
        datasets: [{
            label: 'Ventes',
            data: [10, 20, 15, 25],
        }]
    }}
/>`
        
        const textarea = document.querySelector('textarea');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = editedContent.substring(0, start) + chartTemplate + editedContent.substring(end);
            setEditedContent(newContent);
            setHasUnsavedChanges(newContent !== selectedFile);
            
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + chartTemplate.length, start + chartTemplate.length);
            }, 0);
        }
    }

    async function handleSave() {
        if (!selectedFilePath || !hasUnsavedChanges) return;
        
        setIsSaving(true);
        try {
            await saveFile(selectedFilePath, editedContent);
            setSelectedFile(editedContent);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving file:', error);
        } finally {
            setIsSaving(false);
        }
    }

    function handleFileSelect(filePath: string) {
        if (hasUnsavedChanges) {
            const confirm = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous continuer sans sauvegarder ?');
            if (!confirm) return;
        }
        setSelectedFilePath(filePath);
    }

    function renderNode(node: FileNode) {
        const atRoot = isAtRoot(node.path);
        const isClosed = closedFolders.has(node.path);
        let label = node.name.replace(/\.mdx?$/i, '');
        if (!atRoot && label.length > 15) label = label.slice(0, 15) + '...';

        return (
        <div key={node.path} className="flex flex-col">
            <div>
                {node.is_dir ? (
                    <button onClick={() => toggleFolder(node.path)} className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full">
                    {isClosed ? <ChevronDown /> : <ChevronUp />}<span className="ml-1">{label}</span>
                    </button>
                ) : (
                    <button onClick={() => handleFileSelect(node.path)} className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full">
                    <FileText size={20} /><span className="ml-1">{label}</span>
                    </button>
                )}
            </div>
            {node.is_dir && (
                <div className={`flex flex-col ml-6 transition-[max-height] duration-100 overflow-hidden ${isClosed ? 'max-h-0' : 'max-h-[1000px]'}`}>
                    {node.children?.map(child => renderNode(child))}
                </div>
            )}
        </div>
        );
    }

    const isMarkdownFile = selectedFilePath?.match(/\.mdx?$/i) || selectedFilePath?.match(/\.md?$/i);

    return (
        <div className="w-full bg-background flex">
            <aside className="w-60 border-r border-border overflow-y-auto text-white p-4">
                {tree ? renderNode(tree) : 'Chargement...'}
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col">
                {selectedFile && isMarkdownFile ? (
                    <>
                        {/* Tabs */}
                        <div className="flex items-center justify-between border-b border-border bg-background2 px-4 py-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentTab('edit')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        currentTab === 'edit' 
                                            ? 'bg-background3 text-foreground' 
                                            : 'text-foreground2 hover:text-foreground hover:bg-background3'
                                    }`}
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setCurrentTab('preview')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        currentTab === 'preview' 
                                            ? 'bg-background3 text-foreground' 
                                            : 'text-foreground2 hover:text-foreground hover:bg-background3'
                                    }`}
                                >
                                    <Eye size={16} />
                                    Preview
                                </button>
                            </div>
                            
                            {currentTab === 'edit' && (
                                <button
                                    onClick={handleSave}
                                    disabled={!hasUnsavedChanges || isSaving}
                                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        hasUnsavedChanges && !isSaving
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-background3 text-foreground2 cursor-not-allowed'
                                    }`}
                                >
                                    <Save size={16} />
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto">
                            {currentTab === 'edit' ? (
                                <>
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background2">
                                        <p className="text-foreground">Insérez :</p>
                                        <button
                                            onClick={insertChart}
                                            className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors bg-background3 text-foreground2 hover:text-foreground hover:bg-background"
                                            title="Insérer un graphique"
                                        >
                                            <BarChart3 size={16} />
                                            Graphique
                                        </button>
                                    </div>
                                    
                                    {/* Editor */}
                                    <div className="flex-1 p-4 h-full">
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            className="w-full h-full bg-background2 text-foreground p-4 rounded border border-border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                            placeholder="Commencer à écrire..."
                                            spellCheck={false}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="p-5 markdown-body">
                                    {CompiledMDX ? (
                                        <CompiledMDX components={{ Chart }} />
                                    ) : (
                                        <p className="text-foreground whitespace-pre-wrap max-w-3xl">{selectedFile}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : selectedFile ? (
                    <div className="flex-1 overflow-y-auto p-5 text-foreground">
                        <p className="text-foreground whitespace-pre-wrap max-w-3xl">{selectedFile}</p>
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