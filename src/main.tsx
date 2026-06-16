import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Audience = "guardian" | "caregiver" | "partner";

type Feature = {
  title: string;
  copy: string;
};

type Step = {
  title: string;
  copy: string;
};

type NavItem = {
  id: string;
  label: string;
};

const navItems: NavItem[] = [
  { id: "why", label: "품이 필요한 이유" },
  { id: "service", label: "이용 흐름" },
  { id: "app-experience", label: "앱 소개" },
  { id: "trust", label: "안전 원칙" },
  { id: "faq", label: "문의" }
];

const audienceLabels: Record<Audience, string> = {
  guardian: "요청자",
  caregiver: "보호 가능자",
  partner: "협력 기관"
};

const audienceCopy: Record<Audience, Feature[]> = {
  guardian: [
    {
      title: "사정을 설명하는 요청서",
      copy: "갑작스러운 이사, 건강 문제, 경제적 어려움처럼 말하기 어려운 상황을 차분하게 정리할 수 있습니다."
    },
    {
      title: "조건 중심의 보호 가능자 탐색",
      copy: "지역, 기간, 돌봄 조건, 검증 상태를 중심으로 후보를 확인합니다."
    },
    {
      title: "앱 안의 1대1 대화",
      copy: "서로 매칭 의사를 확정한 뒤에만 앱에서 비공개 채팅방이 열립니다."
    }
  ],
  caregiver: [
    {
      title: "감당 가능한 도움만 선택",
      copy: "기간, 동물 유형, 생활 환경, 경험 범위를 미리 설정해 무리한 보호를 줄입니다."
    },
    {
      title: "검증된 정보 확인",
      copy: "기본 건강 정보, 생활 습관, 필요한 준비물을 단계적으로 확인한 뒤 결정할 수 있습니다."
    },
    {
      title: "인수인계 체크리스트",
      copy: "식사, 산책, 투약, 병원 기록, 비상 연락처를 앱에서 한 번에 확인합니다."
    }
  ],
  partner: [
    {
      title: "지역 기반 연결망",
      copy: "동물병원, 보호단체, 지자체와 연결해 유기 전 단계의 도움 요청을 더 빨리 발견합니다."
    },
    {
      title: "민감한 정보 보호",
      copy: "공개 웹은 서비스 설명만 제공하고, 개인 정보와 대화는 앱 안에서만 다룹니다."
    },
    {
      title: "사후 확인 구조",
      copy: "인계 이후에도 앱에서 상태 확인 일정을 관리해 일회성 연결에 그치지 않게 합니다."
    }
  ]
};

const serviceSteps: Step[] = [
  {
    title: "상황 정리",
    copy: "기존 보호자가 앱에서 필요한 도움, 기간, 지역, 돌봄 조건을 입력합니다."
  },
  {
    title: "후보 확인",
    copy: "보호 가능자는 자신이 감당할 수 있는 조건의 요청만 확인합니다."
  },
  {
    title: "상호 확정",
    copy: "요청자와 보호 가능자가 모두 동의하면 1대1 매칭이 성립합니다."
  },
  {
    title: "앱 채팅",
    copy: "매칭이 성립된 두 사람에게만 앱 안의 비공개 채팅방이 열립니다."
  },
  {
    title: "안전 인계",
    copy: "체크리스트를 바탕으로 건강, 생활 습관, 비상 연락처를 빠짐없이 전달합니다."
  }
];

const appPreviewSteps: Step[] = [
  {
    title: "도움 요청 등록",
    copy: "기간, 지역, 돌봄 조건 입력"
  },
  {
    title: "상호 매칭 확정",
    copy: "요청자와 보호 가능자가 모두 선택"
  },
  {
    title: "비공개 채팅",
    copy: "앱 안에서만 대화와 인수인계 진행"
  }
];

const reasons: [string, string][] = [
  ["말하기 어려운 상황", "보호자가 처한 사정은 복잡하고 민감합니다. 품은 비난보다 정리를 돕는 구조를 지향합니다."],
  ["무리한 연결 방지", "도와주고 싶은 마음만으로는 충분하지 않습니다. 기간, 환경, 경험을 확인해야 합니다."],
  ["인수인계의 빈틈", "사료, 병원 기록, 생활 습관, 비상 연락처가 빠지면 다음 보호도 흔들릴 수 있습니다."]
];

const trustPrinciples: [string, string][] = [
  ["상호 동의", "한쪽의 선택만으로 대화가 열리지 않습니다."],
  ["정보 최소화", "공개되는 정보는 필요한 범위로 제한합니다."],
  ["검증 기반", "기본 신원과 돌봄 가능 조건을 확인합니다."],
  ["기록 인계", "중요 정보는 대화에 흩어지지 않게 체크리스트로 남깁니다."]
];

const preparationItems: [string, string][] = [
  ["요청 전 정리", "현재 상황, 가능한 기간, 이동 가능 지역, 꼭 필요한 돌봄 조건을 먼저 정리합니다."],
  ["건강 정보 확인", "예방접종, 투약, 병원 기록, 식사 습관처럼 다음 보호자가 반드시 알아야 할 정보를 준비합니다."],
  ["생활 환경 확인", "보호 가능자는 거주 환경, 가족 동의, 돌봄 가능 시간, 경험 범위를 확인합니다."],
  ["인계 방식 조율", "만남 장소, 이동 방법, 준비물, 비상 연락처를 앱 안에서 단계적으로 맞춥니다."]
];

const roadmapItems: [string, string][] = [
  ["준비 중", "웹사이트에서 품의 방향과 안전 원칙을 먼저 공개합니다."],
  ["비공개 테스트", "요청 등록, 상호 확정, 비공개 채팅, 인수인계 체크리스트를 검증합니다."],
  ["지역 단위 시작", "무리하게 전국으로 넓히기보다 관리 가능한 지역부터 운영 안정성을 확인합니다."],
  ["정식 출시", "앱스토어와 플레이스토어에서 내려받을 수 있도록 안내합니다."]
];

const faqs: [string, string][] = [
  ["웹에서 바로 도움 요청을 할 수 있나요?", "아니요. 웹은 품을 설명하는 공간이고, 민감한 요청과 대화는 앱에서만 진행되도록 설계하고 있습니다."],
  ["채팅은 언제 열리나요?", "요청자와 보호 가능자가 서로 선택해 1대1 매칭이 성립된 뒤에만 비공개 채팅방이 열립니다."],
  ["운영자가 매칭을 정하나요?", "운영자가 임의로 확정하지 않습니다. 두 사람이 서로 확정했을 때 연결되는 구조를 기준으로 합니다."],
  ["인수인계에는 어떤 정보가 필요한가요?", "식사 습관, 산책 또는 생활 루틴, 건강 상태, 병원 기록, 투약 여부, 비상 연락처처럼 다음 보호자가 바로 확인해야 하는 정보를 중심으로 정리합니다."]
];

const partnerItems: [string, string][] = [
  ["동물병원", "건강 정보와 인계 전 확인 항목을 더 정확하게 만들 수 있습니다."],
  ["보호단체", "유기 전 단계의 도움 요청을 발견하고 지역 연결망을 넓힐 수 있습니다."],
  ["지자체와 기관", "지역 단위의 안전한 임시 보호 체계를 함께 실험할 수 있습니다."]
];

function App() {
  const [selectedAudience, setSelectedAudience] = useState<Audience>("guardian");
  const [activeNav, setActiveNav] = useState("why");
  const [activePreviewStep, setActivePreviewStep] = useState(0);
  const [previewFlash, setPreviewFlash] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveNav(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePreviewStep((step) => (step + 1) % appPreviewSteps.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.14
      }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveNav(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const highlightPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPreviewFlash(false);
    window.setTimeout(() => setPreviewFlash(true), 0);
    window.setTimeout(() => setPreviewFlash(false), 1200);
  };

  return (
    <>
      <Intro />
      <Header activeNav={activeNav} progress={scrollProgress} onNavClick={handleNavClick} />
      <main>
        <section className="hero">
          <div className="hero-copy hero-entrance">
            <p className="eyebrow">반려동물을 포기하기 전, 연결되는 다음 선택지</p>
            <h1>품은 사정이 생긴 보호자와 도움을 줄 수 있는 사람을 안전하게 연결합니다.</h1>
            <p className="hero-text">
              웹사이트는 품의 취지와 안전 원칙을 설명하는 공간입니다. 실제 요청, 1대1 매칭, 비공개 채팅,
              인수인계는 앱에서 진행됩니다.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#service">
                서비스 흐름 보기
              </a>
              <button className="secondary-button" type="button" onClick={highlightPreview}>
                앱에서 하는 일
              </button>
            </div>
          </div>
          <AppPreview
            ref={previewRef}
            activeStep={activePreviewStep}
            flash={previewFlash}
          />
        </section>

        <InfoSection id="why" eyebrow="Why" title="유기라는 마지막 선택 전에, 조용한 도움 요청이 필요합니다.">
          <div className="reason-grid">{reasons.map(([title, copy]) => renderInfoCard(title, copy))}</div>
        </InfoSection>

        <section className="service-section reveal" id="service">
          <div className="section-heading">
            <p className="eyebrow">Service Flow</p>
            <h2>품은 감정적 호소보다 절차와 확인을 먼저 설계합니다.</h2>
          </div>
          <div className="flow-list">
            {serviceSteps.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="audience-section reveal" id="app-experience">
          <div className="section-row">
            <div className="section-heading">
              <p className="eyebrow">App Experience</p>
              <h2>앱에서는 역할에 따라 필요한 기능만 보여줍니다.</h2>
            </div>
            <div className="segmented-control" role="group" aria-label="대상 선택">
              {(Object.keys(audienceLabels) as Audience[]).map((audience) => (
                <button
                  className={selectedAudience === audience ? "active" : ""}
                  key={audience}
                  type="button"
                  onClick={() => setSelectedAudience(audience)}
                >
                  {audienceLabels[audience]}
                </button>
              ))}
            </div>
          </div>
          <div className="feature-grid">
            {audienceCopy[selectedAudience].map((feature) => renderInfoCard(feature.title, feature.copy))}
          </div>
        </section>

        <section className="split-section reveal">
          <article className="principle-panel">
            <p className="eyebrow">Web</p>
            <h2>웹사이트의 역할</h2>
            <ul>
              <li>서비스의 문제의식과 원칙을 설명합니다.</li>
              <li>앱 출시 전 관심자와 협력 문의를 받습니다.</li>
              <li>개인 요청, 채팅, 연락처는 다루지 않습니다.</li>
            </ul>
          </article>
          <article className="principle-panel app-panel">
            <p className="eyebrow">App</p>
            <h2>앱의 역할</h2>
            <ul>
              <li>도움 요청과 보호 가능 조건을 등록합니다.</li>
              <li>요청자와 보호 가능자의 상호 확정을 처리합니다.</li>
              <li>매칭 이후 비공개 채팅과 인수인계를 진행합니다.</li>
            </ul>
          </article>
        </section>

        <section className="trust-section reveal" id="trust">
          <div className="section-heading">
            <p className="eyebrow">Trust</p>
            <h2>품이 지키려는 안전 원칙</h2>
          </div>
          <div className="trust-grid">{trustPrinciples.map(([title, copy]) => renderInfoCard(title, copy))}</div>
        </section>

        <ChecklistSection />
        <RoadmapSection />
        <FaqSection />
        <PartnerSection />
        <DownloadSection />
        <Footer />
      </main>
    </>
  );
}

function Intro() {
  return (
    <section className="intro-screen" aria-hidden="true">
      <div className="intro-brand">
        <span className="intro-mark">품</span>
        <span className="intro-text">
          <span className="intro-typed">품 : 평생의 반려(伴侶)</span>
        </span>
        <span className="intro-subtitle">평생을 함께하다</span>
      </div>
    </section>
  );
}

function Header({
  activeNav,
  progress,
  onNavClick
}: {
  activeNav: string;
  progress: number;
  onNavClick: (sectionId: string) => void;
}) {
  return (
    <header className="topbar">
      <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true"></span>
      <a className="brand" href="#" aria-label="품 홈">
        <span className="brand-mark">품</span>
        <span>품 : 평생의 반려(伴侶)</span>
      </a>
      <nav className="nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <button
            className={activeNav === item.id ? "active" : ""}
            key={item.id}
            type="button"
            onClick={() => onNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <a className="ghost-button" href="#download">
        앱 다운로드
      </a>
    </header>
  );
}

const AppPreview = React.forwardRef<
  HTMLDivElement,
  { activeStep: number; flash: boolean }
>(function AppPreview({ activeStep, flash }, ref) {
  return (
    <div className={`hero-panel ${flash ? "preview-flash" : ""}`} id="app-preview" ref={ref} aria-label="품 서비스 구조 요약">
      <div className="phone-shell">
        <div className="phone-top">
          <span></span>
          <strong>품 App</strong>
        </div>
        <div className="app-progress" aria-hidden="true">
          {appPreviewSteps.map((step, index) => (
            <span className={index <= activeStep ? "active" : ""} key={step.title}></span>
          ))}
        </div>
        {appPreviewSteps.map((step, index) => (
          <div
            className={`app-card ${activeStep === index ? "active" : ""}`}
            key={step.title}
          >
            <small>{index + 1}단계</small>
            <strong>{step.title}</strong>
            <p>{step.copy}</p>
          </div>
        ))}
      </div>
      <div className="hero-note">
        <strong>웹은 설명, 앱은 실행</strong>
        <p>민감한 대화와 개인정보는 공개 웹이 아니라 앱의 매칭 이후 단계에서만 다룹니다.</p>
      </div>
    </div>
  );
});

function InfoSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="why-section reveal" id={id}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DownloadSection() {
  return (
    <section className="download-section reveal" id="download">
      <div>
        <p className="eyebrow">App Download</p>
        <h2>품 앱은 모바일에서 더 안전하게 이용할 수 있도록 준비 중입니다.</h2>
        <p>앱에서는 요청 등록, 상호 매칭, 비공개 채팅, 인수인계를 진행합니다.</p>
      </div>
      <div className="download-actions" aria-label="앱 다운로드">
        <button className="store-button" type="button">
          <span>
            <small>Download on the</small>
            <strong>App Store</strong>
          </span>
        </button>
        <button className="store-button" type="button">
          <span>
            <small>Get it on</small>
            <strong>Google Play</strong>
          </span>
        </button>
      </div>
    </section>
  );
}

function ChecklistSection() {
  return (
    <section className="checklist-section reveal">
      <div className="section-heading">
        <p className="eyebrow">Before Matching</p>
        <h2>서로가 준비해야 안전한 연결이 시작됩니다.</h2>
      </div>
      <div className="checklist-grid">
        {preparationItems.map(([title, copy], index) => (
          <article key={title}>
            <span>{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section className="roadmap-section reveal">
      <div className="section-heading">
        <p className="eyebrow">Launch Plan</p>
        <h2>품은 작게 시작하고, 안전하게 넓혀갑니다.</h2>
      </div>
      <div className="roadmap-line">
        {roadmapItems.map(([title, copy]) => (
          <article key={title}>
            <span></span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section reveal" id="faq">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>처음 품을 볼 때 궁금할 수 있는 것들</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="partner-section reveal">
      <div className="partner-copy">
        <p className="eyebrow">Together</p>
        <h2>품은 혼자 해결하는 서비스가 아니라 지역과 함께 만드는 구조입니다.</h2>
        <p>
          반려동물을 둘러싼 문제는 한 사람의 선의만으로 해결되기 어렵습니다. 품은 보호자, 보호 가능자,
          지역 전문가가 같은 기준을 보고 움직일 수 있는 연결 방식을 준비합니다.
        </p>
      </div>
      <div className="partner-list">
        {partnerItems.map(([title, copy]) => renderInfoCard(title, copy))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>품 : 평생의 반려(伴侶)</strong>
        <p>웹은 설명, 앱은 실행. 품은 유기라는 마지막 선택 전에 안전한 연결을 준비합니다.</p>
      </div>
      <a href="#download">앱 다운로드</a>
    </footer>
  );
}

function renderInfoCard(title: string, copy: string) {
  return (
    <article key={title}>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(<App />);
