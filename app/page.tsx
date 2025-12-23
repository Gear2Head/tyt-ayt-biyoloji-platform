import Link from "next/link";
import { GraduationCap, Brain, Target, Users, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background custom-scrollbar">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 hover-glow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Destekli Eğitim Platformu</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-gradient">TYT-AYT Biyoloji</span>
            <br />
            <span className="text-foreground">Başarı Platformu</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            MEB müfredatına %100 uyumlu, AI destekli kişisel çalışma planları ve detaylı konu anlatımları ile hedefine ulaş
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 gradient-primary hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <GraduationCap className="w-5 h-5 mr-2" />
                Hemen Başla
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 transition-all duration-300 hover:bg-primary/5">
                Özellikleri Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Detaylı Konu", icon: Brain },
              { number: "95%", label: "Başarı Oranı", icon: Target },
              { number: "10K+", label: "Aktif Öğrenci", icon: Users },
            ].map((stat, i) => (
              <Card key={i} className="glass border-2 border-primary/20 hover-lift">
                <CardContent className="p-8 text-center">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-4xl font-display font-bold text-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Neden <span className="text-gradient">Bizi Seçmelisiniz?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern teknoloji ve pedagojik yaklaşımları birleştirerek en etkili öğrenme deneyimini sunuyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Kişisel Plan",
                description: "Yapay zeka destekli, kişiselleştirilmiş çalışma planları ile en verimli şekilde çalış",
                gradient: "from-primary to-purple-500"
              },
              {
                icon: Target,
                title: "MEB Uyumlu",
                description: "Tüm içerikler MEB müfredatına ve TYT-AYT sınav formatına birebir uyumlu",
                gradient: "from-accent to-cyan-500"
              },
              {
                icon: TrendingUp,
                title: "İlerleme Takibi",
                description: "Detaylı analitikler ile güçlü ve zayıf yönlerini keşfet, stratejik çalış",
                gradient: "from-success to-emerald-500"
              },
              {
                icon: Sparkles,
                title: "AI Özetler",
                description: "Her konu için AI tarafından oluşturulan ultra kısa, etkili sınav özetleri",
                gradient: "from-warning to-amber-500"
              },
              {
                icon: GraduationCap,
                title: "Uzman İçerik",
                description: "Alanında uzman öğretmenler tarafından hazırlanan detaylı konu anlatımları",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: Users,
                title: "Topluluk",
                description: "Binlerce öğrenci ile etkileşime geç, sorularını sor, deneyimleri paylaş",
                gradient: "from-indigo-500 to-violet-500"
              },
            ].map((feature, i) => (
              <Card key={i} className="group hover-lift hover-glow border-2 border-transparent hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 animated-gradient opacity-5"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Hayalindeki Üniversiteye <span className="text-gradient">Giden Yol</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Hemen ücretsiz hesap oluştur, AI destekli çalışma planını al
                </p>
                <Link href="/register">
                  <Button size="lg" className="text-lg px-10 py-6 gradient-primary hover:shadow-xl hover:shadow-primary/30">
                    Ücretsiz Başla
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

