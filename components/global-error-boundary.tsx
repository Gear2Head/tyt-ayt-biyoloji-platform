"use client"

import React, { Component, ErrorInfo, ReactNode } from "react";
import { bugApi } from "@/lib/bug-logger";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        bugApi.report(error, { componentStack: errorInfo.componentStack });
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <Card className="max-w-md w-full p-6 border-destructive/50 bg-destructive/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-destructive/10 rounded-full">
                                <AlertTriangle className="w-8 h-8 text-destructive" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-foreground">Beklenmeyen Bir Hata Oluştu</CardTitle>
                                <CardDescription>Sistem yöneticilerine otomatik rapor gönderildi.</CardDescription>
                            </div>
                        </div>

                        <div className="bg-background/50 p-3 rounded-lg border text-sm font-mono text-muted-foreground mb-6 overflow-auto max-h-40">
                            {this.state.error?.message || "Bilinmeyen Hata"}
                        </div>

                        <Button onClick={this.handleRetry} className="w-full">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Sayfayı Yenile
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
