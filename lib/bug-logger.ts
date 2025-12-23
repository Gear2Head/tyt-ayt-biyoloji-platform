import { xanoClient } from './xano/xano-client';

export interface BugReport {
    id: string;
    message: string;
    stackTrace?: string;
    componentStack?: string;
    path: string;
    timestamp: Date;
    status: 'open' | 'resolved' | 'ignored';
    aiAnalysis?: {
        reason: string;
        fix: string;
        confidence: number;
    };
}

export const bugApi = {
    /**
     * Report a bug to the backend
     */
    async report(error: Error, info?: { componentStack?: string }) {
        if (process.env.NODE_ENV === 'development') {
            console.log('🐞 Bug Report Intercepted (Dev Mode):', error.message);
            // In dev, we might still want to test the API, but suppress alert spam
        }

        try {
            await xanoClient.post('ai/bug-report', {
                message: error.message,
                stack_trace: error.stack,
                component_stack: info?.componentStack || '',
                path: typeof window !== 'undefined' ? window.location.pathname : '',
                timestamp: new Date().toISOString(),
            });
        } catch (apiError) {
            console.error('Failed to send bug report:', apiError);
            // Fail silently to avoid infinite error loops
        }
    },

    /**
     * Get all bug reports (Admin only)
     */
    async getAll(): Promise<BugReport[]> {
        const response = await xanoClient.get<any[]>('ai/bug-reports');
        return response.map(item => ({
            id: item.id,
            message: item.message,
            stackTrace: item.stack_trace,
            componentStack: item.component_stack,
            path: item.path,
            timestamp: new Date(item.timestamp),
            status: item.status,
            aiAnalysis: item.ai_analysis,
        }));
    },

    /**
     * Resolve a bug report
     */
    async resolve(id: string) {
        await xanoClient.patch(`ai/bug-reports/${id}`, { status: 'resolved' });
    }
};
