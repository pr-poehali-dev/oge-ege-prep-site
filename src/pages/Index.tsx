import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "oge" | "ege" | "fipi" | "about" | "cabinet" | "contacts";

const SUBJECTS_OGE = ["Математика", "Русский язык", "Физика", "Химия", "Биология", "История", "Обществознание", "Информатика", "География", "Английский язык"];
const SUBJECTS_EGE = ["Математика (база)", "Математика (профиль)", "Русский язык", "Физика", "Химия", "Биология", "История", "Обществознание", "Информатика", "Английский язык", "Литература", "География"];

const ACHIEVEMENTS = [
  { icon: "🔥", title: "Неделя без пропусков", desc: "7 дней подряд", earned: true },
  { icon: "⚡", title: "Скоростной решатель", desc: "50 задач за день", earned: true },
  { icon: "🎯", title: "Снайпер", desc: "10 задач без ошибок", earned: true },
  { icon: "🏆", title: "Мастер ЕГЭ", desc: "90+ баллов в пробнике", earned: false },
  { icon: "💎", title: "Перфекционист", desc: "100% в тесте", earned: false },
  { icon: "🚀", title: "На орбите", desc: "1000 XP за месяц", earned: false },
];

const STATS_MOCK = [
  { label: "Задач решено", value: 347, suffix: "", color: "#00e5a0" },
  { label: "Серия занятий", value: 12, suffix: " дней", color: "#a855f7" },
  { label: "Прогноз балл", value: 78, suffix: " / 100", color: "#3b82f6" },
  { label: "XP набрано", value: 2840, suffix: "", color: "#f97316" },
];

const FIPI_VARIANTS = [
  { year: 2024, subject: "Математика профиль", count: 36, difficulty: "Высокий" },
  { year: 2024, subject: "Русский язык", count: 27, difficulty: "Средний" },
  { year: 2023, subject: "Обществознание", count: 29, difficulty: "Средний" },
  { year: 2024, subject: "Физика", count: 32, difficulty: "Высокий" },
  { year: 2023, subject: "Биология", count: 28, difficulty: "Средний" },
  { year: 2024, subject: "История", count: 25, difficulty: "Высокий" },
];

const SCORE_HISTORY = [45, 52, 58, 61, 67, 72, 75, 78];
const MONTHS = ["Сен", "Окт", "Ноя", "Дек", "Янв", "Фев", "Мар", "Апр"];
const SUBJ_EMOJIS = ["📐", "📝", "⚡", "🧪", "🌿", "📜", "🏛️", "💻", "🌍", "🇬🇧", "📖", "🗺️"];
const SUBJ_PROGRESS = [0, 35, 60, 20, 80, 45, 30, 55, 15, 70, 40, 25];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ProgressRing({ value, max, size = 80, color = "#00e5a0" }: { value: number; max: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

function ScoreChart() {
  const height = 100;
  const width = 300;
  const points = SCORE_HISTORY.map((v, i) => ({
    x: (i / (SCORE_HISTORY.length - 1)) * width,
    y: height - (v / 100) * height,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00e5a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px #00e5a0)" }} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3}
          fill={i === points.length - 1 ? "#00e5a0" : "#0d1f17"} stroke="#00e5a0" strokeWidth="2"
          style={{ filter: i === points.length - 1 ? "drop-shadow(0 0 6px #00e5a0)" : "none" }} />
      ))}
    </svg>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const xp = 2840;
  const level = 7;
  const streak = 12;
  const xpInLevel = xp % 500;
  const xpNeeded = 500;

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "oge", label: "ОГЭ", icon: "BookOpen" },
    { id: "ege", label: "ЕГЭ", icon: "GraduationCap" },
    { id: "fipi", label: "Банк ФИПИ", icon: "Database" },
    { id: "about", label: "О школе", icon: "Building2" },
    { id: "cabinet", label: "Кабинет", icon: "User" },
    { id: "contacts", label: "Контакты", icon: "MessageCircle" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection("home")}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #00e5a0, #a855f7)", boxShadow: "0 0 20px rgba(0,229,160,0.4)" }}>
              🎯
            </div>
            <span className="font-oswald text-xl font-bold tracking-wide">
              <span className="neon-text-green">ЕГЭ</span>
              <span className="text-foreground/80"> Мастер</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-foreground/60 hover:text-foreground/90 hover:bg-white/5"
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              <span className="text-sm">🔥</span>
              <span className="text-amber-400 text-sm font-semibold">{streak}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 cursor-pointer"
              onClick={() => setActiveSection("cabinet")}>
              <span className="text-xs text-muted-foreground">Ур.{level}</span>
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full xp-bar rounded-full" style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }} />
              </div>
              <span className="text-xs neon-text-green font-semibold">{xp} XP</span>
            </div>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActiveSection(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id ? "bg-primary/15 text-primary" : "text-foreground/60"
                }`}>
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-16">

        {/* ===== ГЛАВНАЯ ===== */}
        {activeSection === "home" && (
          <div>
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-slow"
                  style={{ background: "radial-gradient(circle, #00e5a0, transparent)" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl animate-float"
                  style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
                <div className="absolute top-10 right-10 text-[8rem] opacity-[0.03] font-oswald font-black leading-none">ЕГЭ</div>
                <div className="absolute bottom-10 left-10 text-[6rem] opacity-[0.03] font-oswald font-black leading-none">100</div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
                <div className="animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 mb-6">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                    <span className="text-primary text-xs font-semibold tracking-widest uppercase">Платформа нового поколения</span>
                  </div>
                  <h1 className="font-oswald text-5xl md:text-7xl font-black leading-none mb-4 tracking-tight">
                    <span className="text-foreground">СДАЙ</span><br />
                    <span className="neon-text-green">ЕГЭ И ОГЭ</span><br />
                    <span className="text-foreground">НА </span>
                    <span style={{ color: "#f97316", textShadow: "0 0 20px rgba(249,115,22,0.5)" }}>100</span>
                  </h1>
                  <p className="text-foreground/60 text-lg mb-8 leading-relaxed max-w-md">
                    Игровая подготовка с прогнозом баллов, банком ФИПИ и персональной статистикой. Твой результат — под контролем.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-primary-neon px-8 py-3 rounded-xl font-semibold text-base flex items-center gap-2"
                      onClick={() => setActiveSection("cabinet")}>
                      <Icon name="Rocket" size={18} />
                      Начать подготовку
                    </button>
                    <button className="btn-neon px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2"
                      onClick={() => setActiveSection("fipi")}>
                      <Icon name="Database" size={18} />
                      Банк заданий
                    </button>
                  </div>
                  <div className="flex items-center gap-6 mt-8">
                    {[["1200+", "учеников"], ["98%", "рекомендуют"], ["89", "средний балл"]].map(([val, lbl]) => (
                      <div key={lbl}>
                        <div className="font-oswald text-2xl font-bold neon-text-green">{val}</div>
                        <div className="text-foreground/40 text-xs">{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative animate-slide-up">
                  <div className="glass-card rounded-2xl p-6 border neon-border-green">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-foreground/50 text-xs mb-0.5">Прогноз балла · ЕГЭ Математика</div>
                        <div className="font-oswald text-4xl font-bold neon-text-green">78 / 100</div>
                      </div>
                      <ProgressRing value={78} max={100} size={80} />
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground/50 text-xs">Динамика прогресса</span>
                        <span className="text-primary text-xs font-semibold">+33 за 8 мес.</span>
                      </div>
                      <div className="h-16"><ScoreChart /></div>
                      <div className="flex justify-between mt-1">
                        {MONTHS.map(m => <span key={m} className="text-foreground/30 text-[10px]">{m}</span>)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card rounded-xl p-3">
                        <div className="text-foreground/50 text-xs mb-1">Задач решено</div>
                        <div className="font-oswald text-xl font-bold" style={{ color: "#00e5a0" }}>
                          <AnimatedCounter target={347} />
                        </div>
                      </div>
                      <div className="glass-card rounded-xl p-3">
                        <div className="text-foreground/50 text-xs mb-1">Серия занятий</div>
                        <div className="font-oswald text-xl font-bold" style={{ color: "#a855f7" }}>
                          <AnimatedCounter target={12} suffix=" дн." />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 glass-card rounded-xl px-3 py-2 border border-amber-500/30 animate-float">
                    <div className="flex items-center gap-2"><span>🔥</span><span className="text-amber-400 text-sm font-bold">12 дней</span></div>
                    <div className="text-foreground/40 text-[10px]">серия занятий</div>
                  </div>
                  <div className="absolute -bottom-3 -left-3 glass-card rounded-xl px-3 py-2 border border-purple-500/30 animate-float" style={{ animationDelay: "1.5s" }}>
                    <div className="flex items-center gap-2"><span>⚡</span><span className="text-purple-400 text-sm font-bold">2840 XP</span></div>
                    <div className="text-foreground/40 text-[10px]">уровень 7</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-y border-white/5 py-8">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                {STATS_MOCK.map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-oswald text-3xl font-black mb-1" style={{ color: s.color }}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-foreground/50 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="font-oswald text-3xl font-bold mb-2">Выбери направление</h2>
              <p className="text-foreground/50 mb-8">Адаптивные курсы под твой класс и предмет</p>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[
                  { id: "oge" as Section, badge: "9 класс", title: "ОГЭ", color: "#00e5a0", icon: "BookOpen", desc: "Подготовка к основному государственному экзамену. 10 предметов на выбор, адаптивные задания.", count: "10 предметов" },
                  { id: "ege" as Section, badge: "11 класс", title: "ЕГЭ", color: "#a855f7", icon: "GraduationCap", desc: "Полная подготовка к единому госэкзамену. Профиль или база — всё включено, с прогнозом балла.", count: "12 предметов" },
                ].map(card => (
                  <div key={card.id} className="glass-card glass-card-hover rounded-2xl p-8 cursor-pointer" onClick={() => setActiveSection(card.id)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)`, border: `1px solid ${card.color}40` }}>
                        <Icon name={card.icon} size={26} style={{ color: card.color }} />
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full border font-semibold"
                        style={{ color: card.color, borderColor: `${card.color}40`, background: `${card.color}10` }}>
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-oswald text-4xl font-black mb-2" style={{ color: card.color }}>{card.title}</h3>
                    <p className="text-foreground/60 text-sm mb-4 leading-relaxed">{card.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 text-xs">{card.count}</span>
                      <Icon name="ArrowRight" size={16} style={{ color: card.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="font-oswald text-3xl font-bold mb-2">Почему именно мы</h2>
              <p className="text-foreground/50 mb-8">Система, которая работает на твой результат</p>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { icon: "TrendingUp", color: "#00e5a0", title: "Прогноз балла", desc: "ИИ анализирует результаты и строит прогноз итогового балла с учётом динамики" },
                  { icon: "Zap", color: "#f97316", title: "Игровой формат", desc: "XP, уровни, достижения, серии — готовишься как в игре, результат — как на экзамене" },
                  { icon: "Database", color: "#3b82f6", title: "Банк ФИПИ", desc: "Все официальные задания и варианты прошлых лет с разбором в одном месте" },
                  { icon: "BarChart3", color: "#a855f7", title: "Статистика", desc: "Подробный анализ сильных и слабых тем, прогресс по каждому типу заданий" },
                  { icon: "Users", color: "#eab308", title: "Живые педагоги", desc: "Опытные репетиторы проверяют развёрнутые ответы и дают персональную обратную связь" },
                  { icon: "Shield", color: "#00e5a0", title: "Гарантия", desc: "Если не сдашь на прогнозируемый балл — бесплатно повторим подготовку" },
                ].map(f => (
                  <div key={f.title} className="glass-card glass-card-hover rounded-xl p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <Icon name={f.icon} size={20} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-foreground/50 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== ОГЭ / ЕГЭ ===== */}
        {(activeSection === "oge" || activeSection === "ege") && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8 flex-wrap">
              <div className="flex p-1 glass-card rounded-xl border border-white/10">
                {(["oge", "ege"] as const).map(t => (
                  <button key={t} onClick={() => setActiveSection(t)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold font-oswald transition-all duration-200 ${
                      activeSection === t ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/50 hover:text-foreground"
                    }`}>
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <h1 className="font-oswald text-3xl font-black">
                Подготовка к <span className="neon-text-green">{activeSection === "oge" ? "ОГЭ" : "ЕГЭ"}</span>
              </h1>
            </div>

            <p className="text-foreground/50 mb-8 max-w-2xl">
              {activeSection === "oge"
                ? "Выбери предмет и начни подготовку. Курсы адаптированы под программу 9 класса и требования ФИПИ."
                : "Полная программа подготовки к ЕГЭ с разбором всех типов заданий, пробными экзаменами и прогнозом баллов."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
              {(activeSection === "oge" ? SUBJECTS_OGE : SUBJECTS_EGE).map((subj, i) => (
                <div key={subj} className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-2xl mb-3">{SUBJ_EMOJIS[i] || "📚"}</div>
                  <h3 className="font-semibold text-sm text-foreground mb-2 leading-tight">{subj}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 text-[10px]">{30 + i * 5} ур.</span>
                    <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${SUBJ_PROGRESS[i]}%`,
                        background: "linear-gradient(90deg, #00e5a0, #a855f7)"
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6 border neon-border-green flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-oswald text-xl font-bold mb-1">Пробный <span className="neon-text-green">{activeSection === "oge" ? "ОГЭ" : "ЕГЭ"}</span></div>
                <div className="text-foreground/50 text-sm">Полный вариант по реальным заданиям ФИПИ с автопроверкой и разбором</div>
              </div>
              <button className="btn-primary-neon px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2">
                <Icon name="Play" size={16} />
                Пройти пробник
              </button>
            </div>
          </div>
        )}

        {/* ===== ФИПИ ===== */}
        {activeSection === "fipi" && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8">
              <h1 className="font-oswald text-4xl font-black mb-2">
                Банк заданий <span className="neon-text-green">ФИПИ</span>
              </h1>
              <p className="text-foreground/50">Официальные варианты и задания для самостоятельной подготовки</p>
            </div>
            <div className="flex gap-3 mb-6 flex-wrap">
              {["Все", "2024", "2023", "2022", "Математика", "Русский", "Физика"].map((f, i) => (
                <button key={f} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  i === 0 ? "border-primary/50 bg-primary/15 text-primary" : "border-white/10 text-foreground/50 hover:border-white/20 hover:text-foreground/80"
                }`}>{f}</button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIPI_VARIANTS.map((v, i) => (
                <div key={i} className="glass-card glass-card-hover rounded-xl p-5 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{v.year}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      v.difficulty === "Высокий" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>{v.difficulty}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{v.subject}</h3>
                  <div className="text-foreground/40 text-xs mb-4">{v.count} заданий</div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 rounded-lg text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all">Решать</button>
                    <button className="py-2 px-3 rounded-lg text-xs border border-white/10 text-foreground/50 hover:text-foreground/80 transition-all">
                      <Icon name="Download" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button className="btn-neon px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
                <Icon name="RefreshCw" size={16} />
                Загрузить ещё
              </button>
            </div>
          </div>
        )}

        {/* ===== О ШКОЛЕ ===== */}
        {activeSection === "about" && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
              <h1 className="font-oswald text-4xl font-black mb-2">О <span className="neon-text-green">школе</span></h1>
              <p className="text-foreground/50 max-w-2xl">Мы — команда педагогов и разработчиков, создавших первую игровую платформу подготовки к ЕГЭ и ОГЭ</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { num: "5+", label: "лет на рынке", icon: "Calendar", color: "#00e5a0" },
                { num: "1200+", label: "выпускников", icon: "Users", color: "#a855f7" },
                { num: "89", label: "средний балл ЕГЭ", icon: "Award", color: "#f97316" },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                    <Icon name={s.icon} size={22} style={{ color: s.color }} />
                  </div>
                  <div className="font-oswald text-4xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
                  <div className="text-foreground/50 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-oswald text-2xl font-bold mb-4">Наш подход</h2>
                <div className="space-y-4">
                  {[
                    ["🎮", "Игровая механика", "Задания в формате игры удерживают внимание и повышают запоминание на 40%"],
                    ["📊", "Данные в основе", "Каждый урок адаптируется под твой прогресс и пробелы в знаниях"],
                    ["👨‍🏫", "Живые педагоги", "ИИ помогает, но финальную проверку делают опытные учителя"],
                  ].map(([icon, title, desc]) => (
                    <div key={title as string} className="flex gap-4">
                      <span className="text-2xl flex-shrink-0">{icon}</span>
                      <div>
                        <div className="font-semibold text-sm mb-0.5">{title as string}</div>
                        <div className="text-foreground/50 text-sm leading-relaxed">{desc as string}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-oswald text-2xl font-bold mb-4">Команда</h2>
                <div className="space-y-3">
                  {[
                    { name: "Анна Михайлова", role: "Математика, физика", exp: "15 лет опыта" },
                    { name: "Дмитрий Соколов", role: "Русский язык, литература", exp: "12 лет опыта" },
                    { name: "Елена Петрова", role: "Обществознание, история", exp: "10 лет опыта" },
                  ].map(t => (
                    <div key={t.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, rgba(0,229,160,0.1), rgba(168,85,247,0.1))", border: "1px solid rgba(0,229,160,0.2)" }}>
                        👤
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-foreground/40 text-xs">{t.role} · {t.exp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== КАБИНЕТ ===== */}
        {activeSection === "cabinet" && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="font-oswald text-3xl font-black">Личный кабинет</h1>
                <p className="text-foreground/50 text-sm">Алексей Иванов · 11 класс</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="glass-card rounded-xl px-4 py-2 border border-amber-500/30 flex items-center gap-2">
                  <span>🔥</span><span className="font-bold text-amber-400">{streak} дней</span>
                  <span className="text-foreground/40 text-xs">серия</span>
                </div>
                <div className="glass-card rounded-xl px-4 py-2 border border-primary/30 flex items-center gap-2">
                  <span>⚡</span><span className="font-bold text-primary">{xp} XP</span>
                  <span className="text-foreground/40 text-xs">ур.{level}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground/60">Прогресс до {level + 1} уровня</span>
                <span className="text-sm text-primary font-semibold">{xpInLevel} / {xpNeeded} XP</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full xp-bar rounded-full" style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-oswald text-xl font-bold">Прогноз баллов</h2>
                  <span className="text-xs text-foreground/40">ЕГЭ Математика</span>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div className="relative flex-shrink-0">
                    <ProgressRing value={78} max={100} size={100} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-oswald text-2xl font-black neon-text-green">78</span>
                      <span className="text-foreground/40 text-xs">прогноз</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground/60">Динамика</span>
                      <span className="text-primary text-sm font-semibold">+33 за 8 мес.</span>
                    </div>
                    <div className="h-16"><ScoreChart /></div>
                    <div className="flex justify-between">
                      {MONTHS.map(m => <span key={m} className="text-foreground/30 text-[10px]">{m}</span>)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Текущий тренд", val: "+5 / мес", good: true },
                    { label: "До цели 85", val: "7 баллов", good: false },
                    { label: "Вероятность", val: "73%", good: true },
                  ].map(s => (
                    <div key={s.label} className="glass-card rounded-xl p-3 text-center">
                      <div className={`font-oswald text-lg font-bold ${s.good ? "neon-text-green" : "text-amber-400"}`}>{s.val}</div>
                      <div className="text-foreground/40 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {STATS_MOCK.map(s => (
                  <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                    <div className="relative flex-shrink-0 w-10 h-10">
                      <ProgressRing value={s.value} max={s.label === "XP набрано" ? 5000 : 500} size={40} color={s.color} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold" style={{ color: s.color }}>
                        <AnimatedCounter target={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-foreground/40 text-xs">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/5 mb-6">
              <h2 className="font-oswald text-xl font-bold mb-4">Достижения</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {ACHIEVEMENTS.map(a => (
                  <div key={a.title} className={`rounded-xl p-3 text-center transition-all border ${
                    a.earned ? "border-primary/30 bg-primary/10" : "border-white/5 opacity-40"
                  }`}>
                    <div className={`text-2xl mb-1.5 ${!a.earned ? "grayscale" : ""}`}>{a.icon}</div>
                    <div className="text-xs font-semibold text-foreground/80 leading-tight">{a.title}</div>
                    <div className="text-foreground/40 text-[10px] mt-0.5">{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border neon-border-purple">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-oswald text-xl font-bold mb-1">Тариф: <span style={{ color: "#a855f7" }}>Про</span></h2>
                  <p className="text-foreground/50 text-sm">Все предметы, пробники, проверка педагогами · до 31 мая 2026</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 transition-all">Продлить</button>
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold border border-white/10 text-foreground/50 hover:text-foreground transition-all flex items-center gap-1.5">
                    <Icon name="Receipt" size={14} />
                    Платежи
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== КОНТАКТЫ ===== */}
        {activeSection === "contacts" && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="font-oswald text-4xl font-black mb-2">
              <span className="neon-text-green">Контакты</span> и поддержка
            </h1>
            <p className="text-foreground/50 mb-10">Мы на связи — отвечаем в течение нескольких часов</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: "MessageCircle", color: "#00e5a0", title: "Telegram", desc: "@ege_master_support", action: "Написать" },
                { icon: "Mail", color: "#3b82f6", title: "Email", desc: "help@egemaster.ru", action: "Отправить" },
                { icon: "Phone", color: "#a855f7", title: "Телефон", desc: "+7 (800) 123-45-67", action: "Позвонить" },
                { icon: "Clock", color: "#f97316", title: "Время работы", desc: "Пн–Пт: 9:00 – 20:00", action: null },
              ].map(c => (
                <div key={c.title} className="glass-card glass-card-hover rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                    <Icon name={c.icon} size={22} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-0.5">{c.title}</div>
                    <div className="text-foreground/50 text-sm">{c.desc}</div>
                  </div>
                  {c.action && (
                    <button className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-white/5"
                      style={{ borderColor: `${c.color}40`, color: c.color }}>
                      {c.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-8 border border-white/5">
              <h2 className="font-oswald text-2xl font-bold mb-6">Написать нам</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Имя</label>
                    <input className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 transition-all text-sm" placeholder="Алексей" />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Email или телефон</label>
                    <input className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 transition-all text-sm" placeholder="alex@mail.ru" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-foreground/60 mb-1.5 block">Тема</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm">
                    <option value="" className="bg-[#0d1117]">Выбери тему</option>
                    <option value="tech" className="bg-[#0d1117]">Техническая проблема</option>
                    <option value="edu" className="bg-[#0d1117]">Учебный вопрос</option>
                    <option value="pay" className="bg-[#0d1117]">Оплата и тарифы</option>
                    <option value="other" className="bg-[#0d1117]">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-foreground/60 mb-1.5 block">Сообщение</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 transition-all text-sm resize-none" placeholder="Опиши свой вопрос..." />
                </div>
                <button className="btn-primary-neon px-8 py-3 rounded-xl font-semibold flex items-center gap-2">
                  <Icon name="Send" size={16} />
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-oswald font-bold">
              <span className="neon-text-green">ЕГЭ</span> Мастер
            </span>
            <span className="text-foreground/30 text-sm">· Платформа подготовки к экзаменам</span>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className="text-foreground/40 text-sm hover:text-foreground/70 transition-colors">
                {item.label}
              </button>
            ))}
          </div>
          <div className="text-foreground/30 text-xs">© 2026 ЕГЭ Мастер</div>
        </div>
      </footer>
    </div>
  );
}
