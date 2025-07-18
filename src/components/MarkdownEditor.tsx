import { useState, useEffect } from 'react';
import { BarChart3 } from "lucide-react";
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import Chart from '@/components/markdown/Chart';
import { EditorTabs } from '@/components/EditorTabs';
import { ChartModal } from '@/components/ChartModal'
import { ChartConfig } from '@root/types/global'

type TabMode = 'edit' | 'preview';

interface MarkdownEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    hasUnsavedChanges: boolean;
    isSaving: boolean;
    onSave: () => void;
}



export function MarkdownEditor({ content, onContentChange, hasUnsavedChanges, isSaving, onSave }: MarkdownEditorProps) {
    const [currentTab, setCurrentTab] = useState<TabMode>('preview');
    const [CompiledMDX, setCompiledMDX] = useState<React.ComponentType<any> | null>(null);
    const [chartModalOpen, setChartModalOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!content) {
            setCompiledMDX(null);
            return;
        }

        (async () => {
            try {
                const { default: Content } = await evaluate(content, runtime);
                setCompiledMDX(() => Content);
            } catch (error) {
                console.error('MDX compilation error:', error);
                setCompiledMDX(() => () => <div className="text-red-500">Error compiling MDX</div>);
            }
        })();
    }, [content]);

    function insertChart(config: ChartConfig) {
        const { title, type, width, height, data } = config;

        const chartTemplate = `<Chart
  title="${title}"
  type="${type}"
  width={${width}}
  height={${height}}
  data={{
    labels: [${data.labels.map(label => `'${label}'`).join(', ')}],
    datasets: [{
      label: "${data.datasets[0].label}",
      data: [${data.datasets[0].data.join(', ')}],
    }]
  }}
/>`;
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newContent = content.slice(0, start) + chartTemplate + content.slice(end);
        onContentChange(newContent);
        textarea.focus();

        setChartModalOpen(false);
    }

    return (
        <>
            <EditorTabs
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                onSave={onSave}
            />

            <div className="flex-1 overflow-y-auto">
                {currentTab === 'edit' ? (
                    <>
                        <div className="flex flex-row sticky top-0 gap-2 px-4 py-2 border-b border-border bg-background2">
                            <p className="text-foreground">Insérez :</p>
                            <button
                                onClick={() => setChartModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors bg-background3 text-foreground2 hover:text-foreground hover:bg-background"
                                title="Insérer un graphique"
                            >
                                <BarChart3 size={16} />
                                Graphique
                            </button>
                        </div>

                        <ChartModal isOpen={chartModalOpen} onClose={() => setChartModalOpen(false)} onSave={insertChart} />


                        <div className="flex-1 p-4 h-full">
                            <textarea
                                value={content}
                                onChange={(e) => onContentChange(e.target.value)}
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
                            <p className="text-foreground whitespace-pre-wrap max-w-3xl">{content}</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}