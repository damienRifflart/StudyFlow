import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { FileNode } from '@/app/hooks/useFileTree';

interface FileTreeProps {
  tree: FileNode | null;
  closedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  rootPath: string;
}

export function FileTree({ tree, closedFolders, onToggleFolder, onSelectFile, rootPath }: FileTreeProps) {
  if (!tree) return <div>Chargement...</div>;

  const isAtRoot = (filePath: string): boolean => {
    const relative = filePath.replace(rootPath, '').replace(/^\//, '');
    return !relative.includes('/') || relative === '';
  };

  const renderNode = (node: FileNode) => {
    const atRoot = isAtRoot(node.path);
    const isClosed = closedFolders.has(node.path);
    let label = node.name.replace(/\.mdx?$/i, '');
    if (!atRoot && label.length > 15) label = label.slice(0, 15) + '...';

    return (
      <div key={node.path} className="flex flex-col">
        <div>
          {node.is_dir ? (
            <button 
              onClick={() => onToggleFolder(node.path)} 
              className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full"
            >
              {isClosed ? <ChevronDown /> : <ChevronUp />}
              <span className="ml-1">{label}</span>
            </button>
          ) : (
            <button 
              onClick={() => onSelectFile(node.path)} 
              className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full"
            >
              <FileText size={20} />
              <span className="ml-1">{label}</span>
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
  };

  return renderNode(tree);
}