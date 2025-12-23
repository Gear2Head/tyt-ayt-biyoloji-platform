import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Xano Configuration
const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL;

export async function POST(request: Request) {
    try {
        // 1. Check Authentication (Verify Xano Token)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { topicId } = body;

        if (!topicId) {
            return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
        }

        // 2. Fetch Topic Details from Xano
        // We forward the user's token to ensure they have admin access to read/write
        const topicResponse = await axios.get(`${XANO_BASE_URL}/topics/${topicId}`, {
            headers: { Authorization: authHeader }
        });
        const topic = topicResponse.data;

        // 3. Generate Content with OpenAI
        const prompt = `
            Sen uzman bir biyoloji öğretmenisin. Aşağıdaki konuyu Türkiye MEB OGM (9-12. Sınıf) müfredatına uygun olarak anlat.
            
            Konu: ${topic.title}
            Kategori: ${topic.category} (${topic.sub_category || ''})
            
            Kurallar:
            1. Akademik ama lise seviyesinde anlaşılır bir dil kullan.
            2. HTML formatında değil, düz metin (text) formatında, paragraflar halinde yaz.
            3. Konunun en can alıcı noktalarını, sınavda çıkabilecek detayları vurgula.
            4. Varsa "Karıştırılan Kavramlar"a değin.
            5. Cevabın sadece konu anlatımı olsun, giriş/çıkış konuşmaları yapma.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        const aiContent = completion.choices[0].message.content;

        // 4. Update Topic in Xano
        const updateResponse = await axios.patch(`${XANO_BASE_URL}/topics/${topicId}`, {
            content_ai: aiContent,
            source: 'AI',
            last_ai_update: new Date().toISOString()
        }, {
            headers: { Authorization: authHeader }
        });

        return NextResponse.json({ success: true, data: updateResponse.data });

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
