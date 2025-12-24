'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopicFormData {
    title: string;
    category: string;
    subCategory: string;
    difficulty: 'kolay' | 'orta' | 'zor';
    content: string;
    priority: number;
    videos: string[];
}

export function TopicEditor({ topicId }: { topicId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TopicFormData>({
        title: '',
        category: '12-sinif',
        subCategory: '',
        difficulty: 'orta',
        content: '',
        priority: 3,
        videos: []
    });
    const [videoInput, setVideoInput] = useState('');

    const handleSave = async () => {
        setLoading(true);
        try {
            // TODO: Save to Xano
            const endpoint = topicId ? `topics/${topicId}` : 'topics';
            const method = topicId ? 'PATCH' : 'POST';

            // Mock save
            console.log('Saving topic:', formData);
            alert('Konu kaydedildi! (Mock)');
            router.push('/topics');
        } catch (error) {
            console.error('Save error:', error);
            alert('Kaydetme hatası!');
        } finally {
            setLoading(false);
        }
    };

    const addVideo = () => {
        if (videoInput.trim()) {
            setFormData(prev => ({
                ...prev,
                videos: [...prev.videos, videoInput.trim()]
            }));
            setVideoInput('');
        }
    };

    const removeVideo = (index: number) => {
        setFormData(prev => ({
            ...prev,
            videos: prev.videos.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Temel Bilgiler</CardTitle>
                    <CardDescription>Konu başlığı ve kategori bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Konu Başlığı *</Label>
                        <Input
                            id="title"
                            placeholder="Örn: Fotosentez ve Kemosentez"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kategori *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="9-sinif">9. Sınıf</SelectItem>
                                    <SelectItem value="10-sinif">10. Sınıf</SelectItem>
                                    <SelectItem value="11-sinif">11. Sınıf</SelectItem>
                                    <SelectItem value="12-sinif">12. Sınıf</SelectItem>
                                    <SelectItem value="tyt">TYT</SelectItem>
                                    <SelectItem value="ayt">AYT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Zorluk *</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kolay">Kolay</SelectItem>
                                    <SelectItem value="orta">Orta</SelectItem>
                                    <SelectItem value="zor">Zor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subCategory">Alt Kategori</Label>
                        <Input
                            id="subCategory"
                            placeholder="Örn: Bioenerji ve Metabolizma"
                            value={formData.subCategory}
                            onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Öncelik (1-5)</Label>
                        <Input
                            id="priority"
                            type="number"
                            min={1}
                            max={5}
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 3 }))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>İçerik</CardTitle>
                    <CardDescription>Konu detayları ve açıklamalar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Konu içeriğini buraya yazın..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={15}
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        Markdown formatı desteklenir
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Videolar</CardTitle>
                    <CardDescription>YouTube video linkleri ekleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="YouTube video URL'si"
                            value={videoInput}
                            onChange={(e) => setVideoInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addVideo()}
                        />
                        <Button onClick={addVideo} size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {formData.videos.length > 0 && (
                        <div className="space-y-2">
                            {formData.videos.map((video, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded border">
                                    <span className="text-sm flex-1 truncate">{video}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeVideo(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button onClick={handleSave} disabled={loading || !formData.title} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                    İptal
                </Button>
            </div>
        </div>
    );
}
