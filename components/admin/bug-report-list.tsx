import { BugReport } from '@/lib/bug-logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { bugApi } from '@/lib/bug-logger';

interface Props {
    reports: BugReport[];
    onResolve: () => void;
}

export function BugReportList({ reports, onResolve }: Props) {
    const [resolving, setResolving] = useState<string | null>(null);

    const handleResolve = async (id: string) => {
        setResolving(id);
        try {
            await bugApi.resolve(id);
            onResolve();
        } catch (error) {
            console.error('Failed to resolve bug:', error);
        } finally {
            setResolving(null);
        }
    };

    if (reports.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>Harika! Sistemde şu an çözülmemiş hata kaydı yok.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <Card key={report.id} className="overflow-hidden border-l-4 border-l-red-500">
                    <CardHeader className="bg-muted/30 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Bug className="w-5 h-5 text-red-500" />
                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                    {report.path}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {report.timestamp.toLocaleString('tr-TR')}
                                </span>
                            </div>
                            <button
                                onClick={() => handleResolve(report.id)}
                                disabled={!!resolving}
                                className={cn(
                                    "text-sm font-medium px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors",
                                    resolving === report.id && "opacity-50"
                                )}
                            >
                                {resolving === report.id ? 'Çözülüyor...' : 'Çözüldü Olarak İşaretle'}
                            </button>
                        </div>
                        <CardTitle className="text-base font-mono mt-2 text-red-900 border-b border-red-100 pb-2 mb-0">
                            {report.message}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 bg-muted/10">
                        {report.aiAnalysis ? (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
                                <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center">
                                    <Brain className="w-4 h-4 mr-2" />
                                    AI Analizi (Güven: %{(report.aiAnalysis.confidence * 100).toFixed(0)})
                                </h4>
                                <p className="text-sm text-blue-800 mb-2">{report.aiAnalysis.reason}</p>
                                <div className="bg-white p-2 rounded border border-blue-200 font-mono text-xs text-blue-700">
                                    {report.aiAnalysis.fix}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic">
                                AI analizi bekleniyor...
                            </div>
                        )}

                        {report.stackTrace && (
                            <details className="mt-2">
                                <summary className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                                    Stack Trace Göster
                                </summary>
                                <pre className="mt-2 text-[10px] bg-slate-900 text-slate-50 p-3 rounded overflow-x-auto">
                                    {report.stackTrace}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Simple Brain icon component since lucide-react might act up if imported directly in some environments, 
// strictly though it should be fine. I'll rely on the existing import.
import { Brain } from 'lucide-react';
