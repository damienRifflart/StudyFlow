import { ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react";
import { FileNode } from '@/app/hooks/useFileTree';

interface FileTreeProps {
  tree: FileNode | null;
  closedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
}

export function FileTree({ tree, closedFolders, onToggleFolder, onSelectFile, onDeleteFile }: FileTreeProps) {
  if (!tree) return <div>Chargement...</div>;

  const renderNode = (node: FileNode) => {
    const isClosed = closedFolders.has(node.path);
    let label = node.name.replace(/\.mdx?$/i, '');
    if (label.length > 15) {
      label = label.slice(0, 15) + '...';
    }
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
              className="flex items-center p-1 mb-1 rounded hover:bg-background2 w-full focus:border border-3 border-border group relative"
            >
              <FileText size={20} />
              <span className="ml-1">{label}</span>
              <a
                className="absolute right-2 w-6 h-6 hidden group-hover:flex items-center justify-center
                          group-hover:text-red-600 group-hover:bg-background rounded-md
                          transition-all duration-300"
                onClick={() => onDeleteFile(node.path)}
              >
                <Trash2 size={16} />
              </a>
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