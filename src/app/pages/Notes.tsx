import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from "react";
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import Chart from '../../components/Chart';

// File node structure from backend
export type FileNode = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
};

export default function Notes() {
    const [tree, setTree] = useState<FileNode | null>(null);
    const rootPath = "/home/damienrifflart/Documents/Notes";
    const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());
    const [selectedFilePath, setSelectedFilePath] = useState<string>();
    const [selectedFile, setSelectedFile] = useState<string>();
    const [CompiledMDX, setCompiledMDX] = useState<React.ComponentType<any> | null>(null);

    async function loadFileTree(folder_path: string): Promise<FileNode> {
        return await invoke<FileNode>('read_tree', { folderpath: folder_path });
    }

    async function loadFile(filePath: string): Promise<string> {
        return await invoke<string>('read_file', { filepath: filePath });
    }

    useEffect(() => {
        loadFileTree(rootPath).then(setTree);
    }, []);

    useEffect(() => {
        if (selectedFilePath) {
            loadFile(selectedFilePath).then(setSelectedFile);
        }
    }, [selectedFilePath]);

    useEffect(() => {
        if (!selectedFile) {
            setCompiledMDX(null);
            return;
        }

        (async () => {
            const { default: Content } = await evaluate(selectedFile, runtime);
            setCompiledMDX(() => Content);
        })();
    }, [selectedFile]);

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

    function renderNode(node: FileNode) {
        const atRoot = isAtRoot(node.path);
        const isClosed = closedFolders.has(node.path);
        let label = node.name.replace(/\.mdx?$/i, '');
        if (!atRoot && label.length > 10) label = label.slice(0, 10) + '...';

        return (
        <div key={node.path} className="flex flex-col">
            <div>
                {node.is_dir ? (
                    <button onClick={() => toggleFolder(node.path)} className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full">
                    {isClosed ? <ChevronDown /> : <ChevronUp />}<span className="ml-1">{label}</span>
                    </button>
                ) : (
                    <button onClick={() => setSelectedFilePath(node.path)} className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full">
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

  return (
    <div className="w-full bg-background flex">
        <aside className="w-80 border-r border-border overflow-y-auto text-white p-4">
            {tree ? renderNode(tree) : 'Chargement...'}
        </aside>

        <main className="flex-1 overflow-y-auto p-5 text-foreground">
            {!selectedFile ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground2 gap-2">
                    <FileText size={50} />
                    <span className="text-lg">Aucune note sélectionnée.</span>
                    <span className="text-lg">Sélectionnez une note dans l'arborescence.</span>
                </div>
            ) : CompiledMDX ? (
                <CompiledMDX components={{ Chart }} />
            ) : (
                <p className="text-foreground whitespace-pre-wrap max-w-3xl">{selectedFile}</p>
            )}
        </main>
    </div>
  );
}