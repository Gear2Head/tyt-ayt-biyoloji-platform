import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        // Initialize OpenAI lazily
        if (!process.env.OPENAI_API_KEY) {
            console.error('Missing OPENAI_API_KEY environment variable');
            return NextResponse.json(
                { error: 'AI servisi şu anda kullanılamıyor.' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const body = await request.json();
        const { topic, difficulty, examType, count = 5, keywords = [] } = body;

        if (!topic) {
            return NextResponse.json(
                { error: 'Konu başlığı gereklidir' },
                { status: 400 }
            );
        }

        const prompt = `Sen bir AYT Biyoloji sınavı soru hazırlayıcısısın. Aşağıdaki özelliklerde ${count} adet çoktan seçmeli soru oluştur:

Konu: ${topic}
Zorluk: ${difficulty}
Sınav Türü: ${examType}
${keywords.length > 0 ? `Anahtar Kelimeler: ${keywords.join(', ')}` : ''}

Her soru için aşağıdaki JSON formatını kullan:
{
  "questionText": "Soru metni",
  "options": {
    "A": "Şık A",
    "B": "Şık B",
    "C": "Şık C",
    "D": "Şık D",
    "E": "Şık E"
  },
  "correctAnswer": "A",
  "explanation": "Açıklama"
}

Kurallar:
- Sorular ${examType} seviyesinde olmalı
- Her soru "${difficulty}" zorlukta olmalı
- Şıklar mantıklı ve gerçekçi olmalı
- Doğru cevap açıklaması detaylı olmalı
- Yanıltıcı şıklar da mantıklı görünmeli

Sadece JSON array dön, başka hiçbir şey ekleme.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Sen AYT Biyoloji sorularında uzmanlaşmış bir yapay zekasın. ÖSYM tarzı sorular üretiyorsun.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4000
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('AI yanıt üretemedi');
        }

        // Parse JSON response
        let questions;
        try {
            questions = JSON.parse(content);
        } catch {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[1]);
            } else {
                throw new Error('JSON parse hatası');
            }
        }

        // Add metadata to questions
        const enhancedQuestions = questions.map((q: any, index: number) => ({
            ...q,
            id: `ai-${Date.now()}-${index}`,
            difficulty,
            examType,
            source: 'AI' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: keywords
        }));

        return NextResponse.json({
            success: true,
            questions: enhancedQuestions,
            count: enhancedQuestions.length
        });

    } catch (error: any) {
        console.error('AI soru üretimi hatası:', error);
        return NextResponse.json(
            { error: 'Soru üretimi sırasında bir hata oluştu: ' + error.message },
            { status: 500 }
        );
    }
}
