import { BarChart3, LineChart, PieChart, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

interface ChartConfig {
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    width: number;
    height: number;
    data: ChartData;
}

interface ChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: ChartConfig) => void;
    editingChart?: ChartConfig | null;
}

export function ChartModal({ isOpen, onClose, onSave, editingChart }: ChartModalProps) {
    const [config, setConfig] = useState<ChartConfig>(() =>
        editingChart || {
            id: Date.now().toString(),
            title: 'Mon graphique',
            type: 'bar',
            width: 400,
            height: 300,
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Série 1',
                    data: [10, 20, 15],
                    backgroundColor: '#3b82f6',
                    borderColor: '#1d4ed8'
                }]
            }
        }
    );

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    const addDataPoint = () => {
        setConfig(prev => ({
            ...prev,
            data: {
                ...prev.data,
                labels: [...prev.data.labels, `Label ${prev.data.labels.length + 1}`],
                datasets: prev.data.datasets.map(dataset => ({
                    ...dataset,
                    data: [...dataset.data, 0]
                }))
            }
        }));
    };

    const removeDataPoint = (index: number) => {
        setConfig(prev => ({
            ...prev,
            data: {
                ...prev.data,
                labels: prev.data.labels.filter((_, i) => i !== index),
                datasets: prev.data.datasets.map(dataset => ({
                    ...dataset,
                    data: dataset.data.filter((_, i) => i !== index)
                }))
            }
        }));
    };

    const updateLabel = (index: number, value: string) => {
        setConfig(prev => ({
            ...prev,
            data: {
                ...prev.data,
                labels: prev.data.labels.map((label, i) => i === index ? value : label)
            }
        }));
    };

    const updateDataValue = (index: number, value: number) => {
        setConfig(prev => ({
            ...prev,
            data: {
                ...prev.data,
                datasets: prev.data.datasets.map((dataset, datasetIndex) =>
                    datasetIndex === 0
                        ? { ...dataset, data: dataset.data.map((val, i) => i === index ? value : val) }
                        : dataset
                )
            }
        }));
    };

    const chartTypes = [
        { type: 'bar', icon: BarChart3, label: 'Barres' },
        { type: 'line', icon: LineChart, label: 'Ligne' },
        { type: 'pie', icon: PieChart, label: 'Secteurs' },
        { type: 'doughnut', icon: PieChart, label: 'Anneau' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">
                        {editingChart ? 'Modifier le graphique' : 'Nouveau graphique'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background2 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Titre
                        </label>
                        <input
                            type="text"
                            value={config.title}
                            onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-2 bg-background2 border border-border rounded text-foreground"
                            placeholder="Titre du graphique"
                        />
                    </div>

                    {/* Type de graphique */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Type de graphique
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {chartTypes.map(({ type, icon: Icon, label }) => (
                                <button
                                    key={type}
                                    onClick={() => setConfig(prev => ({ ...prev, type: type as any }))}
                                    className={`flex flex-col items-center gap-2 p-3 rounded border transition-colors ${config.type === type
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-background2 border-border text-foreground hover:bg-background3'
                                        }`}
                                >
                                    <Icon size={24} />
                                    <span className="text-xs">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Largeur
                            </label>
                            <input
                                type="number"
                                value={config.width}
                                onChange={(e) => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                                className="w-full p-2 bg-background2 border border-border rounded text-foreground"
                                min="200"
                                max="800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Hauteur
                            </label>
                            <input
                                type="number"
                                value={config.height}
                                onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                                className="w-full p-2 bg-background2 border border-border rounded text-foreground"
                                min="200"
                                max="600"
                            />
                        </div>
                    </div>

                    {/* Données */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-foreground">
                                Données
                            </label>
                            <button
                                onClick={addDataPoint}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Ajouter
                            </button>
                        </div>

                        <div className="space-y-2">
                            {config.data.labels.map((label, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={label}
                                        onChange={(e) => updateLabel(index, e.target.value)}
                                        className="flex-1 p-2 bg-background2 border border-border rounded text-foreground"
                                        placeholder="Label"
                                    />
                                    <input
                                        type="number"
                                        value={config.data.datasets[0]?.data[index] || 0}
                                        onChange={(e) => updateDataValue(index, parseFloat(e.target.value) || 0)}
                                        className="w-20 p-2 bg-background2 border border-border rounded text-foreground"
                                        placeholder="0"
                                    />
                                    <button
                                        onClick={() => removeDataPoint(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        disabled={config.data.labels.length <= 1}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Label du dataset */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Nom de la série
                        </label>
                        <input
                            type="text"
                            value={config.data.datasets[0]?.label || ''}
                            onChange={(e) => setConfig(prev => ({
                                ...prev,
                                data: {
                                    ...prev.data,
                                    datasets: [{
                                        ...prev.data.datasets[0],
                                        label: e.target.value
                                    }]
                                }
                            }))}
                            className="w-full p-2 bg-background2 border border-border rounded text-foreground"
                            placeholder="Nom de la série"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-foreground2 hover:text-foreground"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {editingChart ? 'Modifier' : 'Créer'}
                    </button>
                </div>
            </div>
        </div>
    );
}