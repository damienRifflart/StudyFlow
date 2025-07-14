import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from "react";

type FileNode = {
    name: string;
    path: string;
    is_dir: boolean;
    children?: FileNode[]; // if is_dir === True
};

export default function Notes() {
    const [tree, setTree] = useState<FileNode | null>(null);
    const rootPath = "/home/damienrifflart/Documents/Notes";
    const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());

    async function loadFileTree(folderPath: string): Promise<FileNode> {
        const tree = await invoke<FileNode>('read_dir_recursive', { dirPath: folderPath });
        return tree;
    }

    useEffect(() => {
        loadFileTree('/home/damienrifflart/Documents/Notes').then(setTree);
    }, []);

    function isAtRoot(filePath: string): boolean {
        const relativePath = filePath.replace(rootPath, "").replace("/", "");
        return !relativePath.includes("/") || relativePath === "";
    }

    function toggleFolder(path: string) {
        setClosedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path); // open
            } else {
                newSet.add(path); // close
            }
            return newSet;
        });
    }

      function renderNode(node: FileNode) {
        const atRoot = isAtRoot(node.path);
        const isClosed = closedFolders.has(node.path);

        let displayName = node.name;
        if (!atRoot) {
            displayName = node.name.endsWith(".md")
                ? node.name.slice(0, -3)
                : node.name;
            if (displayName.length >= 10) displayName = displayName.slice(0, 10) + "...";
        } else {
            displayName = node.name.endsWith(".md")
                ? node.name.slice(0, -3)
                : node.name;
        }

        return (
        <div key={node.path} className="flex flex-col">
            <div
                className="flex flex-row gap-1 p-1 w-[calc(100%-1rem)] rounded hover:bg-background2 cursor-pointer mb-1"
            >
                {node.is_dir ? (
                    <button onClick={() => toggleFolder(node.path)}>
                        {isClosed ? <ChevronDown /> : <ChevronUp />}
                    </button>
                ) : (
                    <FileText size={20} />
                )}
                {displayName}
            </div>

            <div
                className={`flex flex-col ml-6 transition-all duration-100 overflow-hidden ${
                    isClosed ? "max-h-0" : "max-h-[1000px]"
                }`}
            >
                {node.is_dir &&
                    node.children?.map(child => renderNode(child))
                }
            </div>
        </div>
        );
    }

    return (
        <div className="w-full bg-background flex flex-row">
            <div className="w-[20rem] border-r-2 border-border h-full text-white ml-5 mt-5">
                {tree ? (
                    <div className="flex flex-col">
                        {tree.is_dir && tree.children?.map(child => renderNode(child))}
                    </div>
                ) : (
                    "Chargement..."
                )}
            </div>

            <div className="h-full w-full flex flex-col justify-center items-center text-foreground2 gap-2">
                <FileText size={50} />
                <span className="text-lg">Aucune note de sélectionnée.</span>
                <span className="text-lg">Sélectionnez une note dans l'arborescence.</span>
            </div>
        </div>
    );
}