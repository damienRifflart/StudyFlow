import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export type FileNode = {
    name: string;
    path: string;
    is_dir: boolean;
    children?: FileNode[];
};

export function useFileTree(rootPath: string) {
    const [tree, setTree] = useState<FileNode | null>(null);
    const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());

    useEffect(() => {
        invoke<FileNode>('read_tree', { folderpath: rootPath }).then(setTree);
    }, [rootPath]);

    const toggleFolder = (path: string) => {
        setClosedFolders(prev => {
            const next = new Set(prev);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
        });
    };

    return { tree, closedFolders, toggleFolder };
}