import { invoke } from '@tauri-apps/api/core';

interface SettingsProps {
    rootPath: string;
    setRootPath: (path: string) => void;
}

export default function Settings({ rootPath, setRootPath }: SettingsProps) {
    const handleSelectFolder = async () => {
        try {
            const selected = await invoke('plugin:dialog|open', {
                options: {
                    directory: true,
                    multiple: false,
                    title: 'Choisir un dossier pour les notes',
                }
            });

            if (selected && typeof selected === 'string') {
                setRootPath(selected);
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du dossier:', error);
        }
    };

    return (
        <div className="w-full ml-5 mt-5">
            <h1 className="text-foreground text-3xl font-bold mb-5">Paramètres</h1>
            <div className="w-[30rem]">
                <label className="text-foreground text-xl font-medium">
                    Dossier des notes:
                </label>

                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={handleSelectFolder}
                        className="px-4 py-2 bg-secondary text-white rounded"
                    >
                        Choisir un dossier
                    </button>
                    {rootPath && (
                        <span className="text-md text-gray-400 truncate max-w-xs">
                            {rootPath}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}