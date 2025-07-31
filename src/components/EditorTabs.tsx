import { Edit, Eye, Save } from "lucide-react";

type TabMode = 'edit' | 'preview';

interface EditorTabsProps {
    currentTab: TabMode;
    onTabChange: (tab: TabMode) => void;
    hasUnsavedChanges: boolean;
    isSaving: boolean;
    onSave: () => void;
}

export function EditorTabs({ currentTab, onTabChange, hasUnsavedChanges, isSaving, onSave }: EditorTabsProps) {
    return (
        <div className="flex items-center justify-between border-b border-border bg-background2 px-4 py-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onTabChange('edit')}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${currentTab === 'edit'
                        ? 'bg-background3 text-foreground'
                        : 'text-foreground2 hover:text-foreground hover:bg-background3'
                        }`}
                >
                    <Edit size={16} />
                    Edit
                </button>
                <button
                    onClick={() => onTabChange('preview')}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${currentTab === 'preview'
                        ? 'bg-background3 text-foreground'
                        : 'text-foreground2 hover:text-foreground hover:bg-background3'
                        }`}
                >
                    <Eye size={16} />
                    Preview
                </button>
            </div>

            <button
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${hasUnsavedChanges && !isSaving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-background3 text-foreground2 cursor-not-allowed'
                    }`}
            >
                <Save size={16} />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </div>
    );
}