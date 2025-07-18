import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import Chart from '@/components/markdown/Chart';
import { evaluate } from '@mdx-js/mdx';
import { EditorTabs } from '@/components/EditorTabs';
import * as runtime from 'react/jsx-runtime';
import { ChartModal } from '@/components/ChartModal';
import { ChartConfig } from '@root/types/global';
import { ICommand } from '@uiw/react-md-editor';

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
    const [chartModalOpen, setChartModalOpen] = useState<boolean>(false);
    const [CompiledMDX, setCompiledMDX] = useState<React.ComponentType<any> | null>(null);

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

        const currentContent = content || '';
        const newContent = currentContent + '\n\n' + chartTemplate;

        onContentChange(newContent);
        setChartModalOpen(false);
    }

    const chart: ICommand = {
        name: 'graphique',
        keyCommand: 'graphique',
        buttonProps: { 'aria-label': 'Insérer un graphique' },
        icon: <BarChart3 size={16} />,
        execute: () => setChartModalOpen(true)
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
                    <div className="flex flex-col h-full">

                        <ChartModal isOpen={chartModalOpen} onClose={() => setChartModalOpen(false)} onSave={insertChart} />

                        <div className="p-4" data-color-mode="dark">
                            <MDEditor
                                value={content}
                                onChange={value => onContentChange(value || '')}
                                textareaProps={{
                                    placeholder: 'Commencer à écrire...',
                                    spellCheck: false,
                                    className: 'font-mono text-sm',
                                }}
                                preview="edit"
                                height={typeof window !== 'undefined' ? window.innerHeight - 200 : undefined}
                                commands={[
                                    commands.bold,
                                    commands.italic,
                                    commands.hr,
                                    commands.code,
                                    commands.image,
                                    commands.checkedListCommand,
                                    commands.divider,
                                    chart
                                ]}
                            />
                        </div>
                    </div>
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
