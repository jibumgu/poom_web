import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Audience = "guardian" | "caregiver" | "partner";
type Language = "ko" | "en";

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

const englishContent = {
  navItems: [
    { id: "why", label: "Why Poom" },
    { id: "service", label: "Flow" },
    { id: "app-experience", label: "App" },
    { id: "trust", label: "Safety" },
    { id: "faq", label: "FAQ" }
  ],
  audienceLabels: {
    guardian: "Requester",
    caregiver: "Caregiver",
    partner: "Partner"
  } satisfies Record<Audience, string>,
  audienceCopy: {
    guardian: [
      {
        title: "A request form for difficult situations",
        copy: "Owners can calmly explain situations such as sudden moves, health issues, or financial hardship."
      },
      {
        title: "Condition-based caregiver search",
        copy: "Candidates are reviewed by area, period, care conditions, and verification status."
      },
      {
        title: "Private 1:1 conversation in the app",
        copy: "A private chat opens only after both sides confirm their intention to match."
      }
    ],
    caregiver: [
      {
        title: "Choose only care you can handle",
        copy: "Set your available period, animal type, home environment, and experience level in advance."
      },
      {
        title: "Review verified information",
        copy: "Check health information, daily routines, and required preparation before making a decision."
      },
      {
        title: "Handover checklist",
        copy: "Meals, walks, medication, hospital records, and emergency contacts are organized in the app."
      }
    ],
    partner: [
      {
        title: "Local support network",
        copy: "Hospitals, organizations, and local institutions can discover requests before abandonment happens."
      },
      {
        title: "Sensitive information protection",
        copy: "The public website explains the service only. Personal data and conversations stay inside the app."
      },
      {
        title: "Follow-up structure",
        copy: "After handover, the app can help manage check-ins so the connection does not end as a one-time event."
      }
    ]
  } satisfies Record<Audience, Feature[]>,
  serviceSteps: [
    ["Situation summary", "The current owner enters the needed help, period, area, and care conditions in the app."],
    ["Candidate review", "Caregivers see only requests that match what they can realistically handle."],
    ["Mutual confirmation", "A 1:1 match is created only when both the requester and caregiver agree."],
    ["App chat", "A private chat opens only for the two matched people."],
    ["Safe handover", "Health, daily routine, and emergency information are handed over through a checklist."]
  ] as [string, string][],
  appPreviewSteps: [
    { title: "Request help", copy: "Period, area, and care conditions" },
    { title: "Mutual match", copy: "Both sides confirm the match" },
    { title: "Private chat", copy: "Conversation and handover inside the app" }
  ] satisfies Step[],
  reasons: [
    ["Hard-to-explain situations", "A guardian's situation can be complex and sensitive. Poom is designed to organize before judging."],
    ["Preventing unrealistic matches", "Good intentions are not enough. Period, environment, and experience must be checked."],
    ["Handover gaps", "Missing food, hospital records, routines, or emergency contacts can make the next care unstable."]
  ] as [string, string][],
  trustPrinciples: [
    ["Mutual consent", "A conversation does not open by one person's choice alone."],
    ["Minimum information", "Public information is limited to what is necessary."],
    ["Verification-based", "Basic identity and care conditions are checked."],
    ["Recorded handover", "Important information is kept in a checklist instead of being scattered in chat."]
  ] as [string, string][],
  preparationItems: [
    ["Before requesting", "Organize the current situation, possible period, area, and essential care conditions."],
    ["Health information", "Prepare vaccination, medication, hospital records, and eating habits for the next caregiver."],
    ["Living environment", "Caregivers check home conditions, family consent, available time, and experience."],
    ["Handover method", "Meeting place, travel method, supplies, and emergency contacts are aligned in the app."]
  ] as [string, string][],
  roadmapItems: [
    ["Preparing", "The website first shares Poom's direction and safety principles."],
    ["Private test", "Requests, mutual confirmation, private chat, and handover checklists are tested."],
    ["Local launch", "Poom starts in manageable areas before expanding wider."],
    ["Official release", "Download guidance will be provided for the App Store and Google Play."]
  ] as [string, string][],
  faqs: [
    ["Can I request help directly on the website?", "No. The website explains Poom. Sensitive requests and conversations are designed to happen only in the app."],
    ["When does chat open?", "A private chat opens only after the requester and caregiver mutually confirm a 1:1 match."],
    ["Does the operator decide the match?", "No. The operator does not confirm matches arbitrarily. A match is based on mutual confirmation."],
    ["What information is needed for handover?", "Meals, routines, health status, hospital records, medication, and emergency contacts should be organized."]
  ] as [string, string][],
  partnerItems: [
    ["Animal hospitals", "Health information and pre-handover checks can become more accurate."],
    ["Protection groups", "Requests before abandonment can be discovered through local networks."],
    ["Local institutions", "A safe temporary care structure can be tested at a local level."]
  ] as [string, string][],
  text: {
    brand: "Poom : Lifelong Companion",
    download: "App Download",
    introTitle: "Poom : Lifelong Companion",
    introSubtitle: "Stay together for life",
    heroEyebrow: "Another option before giving up a companion animal",
    heroTitle: "Poom safely connects guardians in difficult situations with people who can help.",
    heroText:
      "The website explains Poom's purpose and safety principles. Requests, 1:1 matching, private chat, and handover take place in the app.",
    serviceButton: "View Service Flow",
    appButton: "What the app does",
    whyEyebrow: "Why",
    whyTitle: "Before abandonment becomes the last option, a quiet way to ask for help is needed.",
    serviceEyebrow: "Service Flow",
    serviceTitle: "Poom designs procedure and verification before emotional appeal.",
    appEyebrow: "App Experience",
    appTitle: "The app shows only the features each role needs.",
    webTitle: "Website Role",
    appRoleTitle: "App Role",
    webItems: ["Explains the problem and principles.", "Receives interest and partnership inquiries before launch.", "Does not handle personal requests, chats, or contacts."],
    appItems: ["Registers help requests and care conditions.", "Handles mutual confirmation between requester and caregiver.", "Provides private chat and handover after matching."],
    trustEyebrow: "Trust",
    trustTitle: "Safety principles Poom protects",
    beforeEyebrow: "Before Matching",
    beforeTitle: "Safe connection starts when both sides are prepared.",
    launchEyebrow: "Launch Plan",
    launchTitle: "Poom starts small and expands safely.",
    faqEyebrow: "FAQ",
    faqTitle: "Questions people may have when first seeing Poom",
    togetherEyebrow: "Together",
    togetherTitle: "Poom is not a service solved alone, but a structure built with local communities.",
    togetherText:
      "Companion animal issues are hard to solve through one person's goodwill alone. Poom prepares a connection model where guardians, caregivers, and local experts can work from the same standards.",
    noteTitle: "Web explains, app executes",
    noteText: "Sensitive conversations and personal data are handled only after matching inside the app, not on the public website.",
    appLabel: "Poom App",
    downloadTitle: "The Poom app is being prepared for safer mobile use.",
    downloadText: "Requests, mutual matching, private chat, and handover will be handled in the app.",
    footerText: "The web explains, the app executes. Poom prepares a safe connection before abandonment becomes the last option."
  }
};

const koreanContent = {
  navItems,
  audienceLabels,
  audienceCopy,
  serviceSteps: serviceSteps.map((step) => [step.title, step.copy] as [string, string]),
  appPreviewSteps,
  reasons,
  trustPrinciples,
  preparationItems,
  roadmapItems,
  faqs,
  partnerItems,
  text: {
    brand: "품 : 평생의 반려(伴侶)",
    download: "앱 다운로드",
    introTitle: "품 : 평생의 반려(伴侶)",
    introSubtitle: "평생을 함께하다",
    heroEyebrow: "반려동물을 포기하기 전, 연결되는 다음 선택지",
    heroTitle: "품은 사정이 생긴 보호자와 도움을 줄 수 있는 사람을 안전하게 연결합니다.",
    heroText:
      "웹사이트는 품의 취지와 안전 원칙을 설명하는 공간입니다. 실제 요청, 1대1 매칭, 비공개 채팅, 인수인계는 앱에서 진행됩니다.",
    serviceButton: "서비스 흐름 보기",
    appButton: "앱에서 하는 일",
    whyEyebrow: "Why",
    whyTitle: "유기라는 마지막 선택 전에, 조용한 도움 요청이 필요합니다.",
    serviceEyebrow: "Service Flow",
    serviceTitle: "품은 감정적 호소보다 절차와 확인을 먼저 설계합니다.",
    appEyebrow: "App Experience",
    appTitle: "앱에서는 역할에 따라 필요한 기능만 보여줍니다.",
    webTitle: "웹사이트의 역할",
    appRoleTitle: "앱의 역할",
    webItems: ["서비스의 문제의식과 원칙을 설명합니다.", "앱 출시 전 관심자와 협력 문의를 받습니다.", "개인 요청, 채팅, 연락처는 다루지 않습니다."],
    appItems: ["도움 요청과 보호 가능 조건을 등록합니다.", "요청자와 보호 가능자의 상호 확정을 처리합니다.", "매칭 이후 비공개 채팅과 인수인계를 진행합니다."],
    trustEyebrow: "Trust",
    trustTitle: "품이 지키려는 안전 원칙",
    beforeEyebrow: "Before Matching",
    beforeTitle: "서로가 준비해야 안전한 연결이 시작됩니다.",
    launchEyebrow: "Launch Plan",
    launchTitle: "품은 작게 시작하고, 안전하게 넓혀갑니다.",
    faqEyebrow: "FAQ",
    faqTitle: "처음 품을 볼 때 궁금할 수 있는 것들",
    togetherEyebrow: "Together",
    togetherTitle: "품은 혼자 해결하는 서비스가 아니라 지역과 함께 만드는 구조입니다.",
    togetherText:
      "반려동물을 둘러싼 문제는 한 사람의 선의만으로 해결되기 어렵습니다. 품은 보호자, 보호 가능자, 지역 전문가가 같은 기준을 보고 움직일 수 있는 연결 방식을 준비합니다.",
    noteTitle: "웹은 설명, 앱은 실행",
    noteText: "민감한 대화와 개인정보는 공개 웹이 아니라 앱의 매칭 이후 단계에서만 다룹니다.",
    appLabel: "품 App",
    downloadTitle: "품 앱은 모바일에서 더 안전하게 이용할 수 있도록 준비 중입니다.",
    downloadText: "앱에서는 요청 등록, 상호 매칭, 비공개 채팅, 인수인계를 진행합니다.",
    footerText: "웹은 설명, 앱은 실행. 품은 유기라는 마지막 선택 전에 안전한 연결을 준비합니다."
  }
};

function App() {
  const [selectedAudience, setSelectedAudience] = useState<Audience>("guardian");
  const [language, setLanguage] = useState<Language>("ko");
  const [activeNav, setActiveNav] = useState("why");
  const [activePreviewStep, setActivePreviewStep] = useState(0);
  const [previewFlash, setPreviewFlash] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const content = language === "ko" ? koreanContent : englishContent;

  useEffect(() => {
    const sections = content.navItems
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
  }, [content.navItems]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePreviewStep((step) => (step + 1) % content.appPreviewSteps.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [content.appPreviewSteps.length]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  const highlightPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPreviewFlash(false);
    window.setTimeout(() => setPreviewFlash(true), 0);
    window.setTimeout(() => setPreviewFlash(false), 1200);
  };

  return (
    <>
      <Intro title={content.text.introTitle} subtitle={content.text.introSubtitle} />
      <Header
        activeNav={activeNav}
        brand={content.text.brand}
        downloadLabel={content.text.download}
        language={language}
        navItems={content.navItems}
        onLanguageChange={setLanguage}
      />
      <main>
        <section className="hero">
          <div className="hero-copy hero-entrance">
            <p className="eyebrow">{content.text.heroEyebrow}</p>
            <h1>{content.text.heroTitle}</h1>
            <p className="hero-text">{content.text.heroText}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#service">
                {content.text.serviceButton}
              </a>
              <button className="secondary-button" type="button" onClick={highlightPreview}>
                {content.text.appButton}
              </button>
            </div>
          </div>
          <AppPreview
            ref={previewRef}
            activeStep={activePreviewStep}
            flash={previewFlash}
            label={content.text.appLabel}
            noteText={content.text.noteText}
            noteTitle={content.text.noteTitle}
            steps={content.appPreviewSteps}
          />
        </section>

        <InfoSection id="why" eyebrow={content.text.whyEyebrow} title={content.text.whyTitle}>
          <div className="reason-grid">{content.reasons.map(([title, copy]) => renderInfoCard(title, copy))}</div>
        </InfoSection>

        <section className="service-section reveal" id="service">
          <div className="section-heading">
            <p className="eyebrow">{content.text.serviceEyebrow}</p>
            <h2>{content.text.serviceTitle}</h2>
          </div>
          <div className="flow-list">
            {content.serviceSteps.map(([title, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="audience-section reveal" id="app-experience">
          <div className="section-row">
            <div className="section-heading">
              <p className="eyebrow">{content.text.appEyebrow}</p>
              <h2>{content.text.appTitle}</h2>
            </div>
            <div className="segmented-control" role="group" aria-label="대상 선택">
              {(Object.keys(content.audienceLabels) as Audience[]).map((audience) => (
                <button
                  className={selectedAudience === audience ? "active" : ""}
                  key={audience}
                  type="button"
                  onClick={() => setSelectedAudience(audience)}
                >
                  {content.audienceLabels[audience]}
                </button>
              ))}
            </div>
          </div>
          <div className="feature-grid">
            {content.audienceCopy[selectedAudience].map((feature) => renderInfoCard(feature.title, feature.copy))}
          </div>
        </section>

        <section className="split-section reveal">
          <article className="principle-panel">
            <p className="eyebrow">Web</p>
            <h2>{content.text.webTitle}</h2>
            <ul>
              {content.text.webItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="principle-panel app-panel">
            <p className="eyebrow">App</p>
            <h2>{content.text.appRoleTitle}</h2>
            <ul>
              {content.text.appItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="trust-section reveal" id="trust">
          <div className="section-heading">
            <p className="eyebrow">{content.text.trustEyebrow}</p>
            <h2>{content.text.trustTitle}</h2>
          </div>
          <div className="trust-grid">{content.trustPrinciples.map(([title, copy]) => renderInfoCard(title, copy))}</div>
        </section>

        <ChecklistSection items={content.preparationItems} text={content.text} />
        <RoadmapSection items={content.roadmapItems} text={content.text} />
        <FaqSection faqs={content.faqs} text={content.text} />
        <PartnerSection items={content.partnerItems} text={content.text} />
        <DownloadSection text={content.text} />
        <Footer text={content.text} />
      </main>
    </>
  );
}

function Intro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="intro-screen" aria-hidden="true">
      <div className="intro-brand">
        <span className="intro-mark">품</span>
        <span className="intro-text">
          <span className="intro-typed" style={{ "--typing-width": `${Math.max(title.length, 16)}ch` } as React.CSSProperties}>
            {title}
          </span>
        </span>
        <span className="intro-subtitle">{subtitle}</span>
      </div>
    </section>
  );
}

function Header({
  activeNav,
  brand,
  downloadLabel,
  language,
  navItems,
  onLanguageChange
}: {
  activeNav: string;
  brand: string;
  downloadLabel: string;
  language: Language;
  navItems: NavItem[];
  onLanguageChange: (language: Language) => void;
}) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    const updateHeaderHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <header className="topbar" ref={headerRef}>
        <a className="brand" href="#" aria-label="품 홈">
          <span className="brand-mark">품</span>
          <span>{brand}</span>
        </a>
        <nav className="nav" aria-label="현재 섹션">
          {navItems.map((item) => (
            <span
              className={activeNav === item.id ? "active" : ""}
              aria-current={activeNav === item.id ? "location" : undefined}
              key={item.id}
            >
              {item.label}
            </span>
          ))}
        </nav>
        <div className="topbar-actions">
          <div className="language-toggle" aria-label="언어 설정">
            <button
              className={language === "ko" ? "active" : ""}
              type="button"
              onClick={() => onLanguageChange("ko")}
            >
              KOR
            </button>
            <button
              className={language === "en" ? "active" : ""}
              type="button"
              onClick={() => onLanguageChange("en")}
            >
              ENG
            </button>
          </div>
          <a className="ghost-button" href="#download">
            {downloadLabel}
          </a>
        </div>
      </header>
      <div className="topbar-spacer" style={{ height: headerHeight }} aria-hidden="true"></div>
    </>
  );
}

const AppPreview = React.forwardRef<
  HTMLDivElement,
  { activeStep: number; flash: boolean; label: string; noteText: string; noteTitle: string; steps: Step[] }
>(function AppPreview({ activeStep, flash, label, noteText, noteTitle, steps }, ref) {
  return (
    <div className={`hero-panel ${flash ? "preview-flash" : ""}`} id="app-preview" ref={ref} aria-label="품 서비스 구조 요약">
      <div className="phone-shell">
        <div className="phone-top">
          <span></span>
          <strong>{label}</strong>
        </div>
        <div className="app-progress" aria-hidden="true">
          {steps.map((step, index) => (
            <span className={index <= activeStep ? "active" : ""} key={step.title}></span>
          ))}
        </div>
        {steps.map((step, index) => (
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
        <strong>{noteTitle}</strong>
        <p>{noteText}</p>
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

function DownloadSection({ text }: { text: typeof koreanContent.text }) {
  return (
    <section className="download-section reveal" id="download">
      <div>
        <p className="eyebrow">App Download</p>
        <h2>{text.downloadTitle}</h2>
        <p>{text.downloadText}</p>
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

function ChecklistSection({ items, text }: { items: [string, string][]; text: typeof koreanContent.text }) {
  return (
    <section className="checklist-section reveal">
      <div className="section-heading">
        <p className="eyebrow">{text.beforeEyebrow}</p>
        <h2>{text.beforeTitle}</h2>
      </div>
      <div className="checklist-grid">
        {items.map(([title, copy], index) => (
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

function RoadmapSection({ items, text }: { items: [string, string][]; text: typeof koreanContent.text }) {
  return (
    <section className="roadmap-section reveal">
      <div className="section-heading">
        <p className="eyebrow">{text.launchEyebrow}</p>
        <h2>{text.launchTitle}</h2>
      </div>
      <div className="roadmap-line">
        {items.map(([title, copy]) => (
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

function FaqSection({ faqs, text }: { faqs: [string, string][]; text: typeof koreanContent.text }) {
  return (
    <section className="faq-section reveal" id="faq">
      <div className="section-heading">
        <p className="eyebrow">{text.faqEyebrow}</p>
        <h2>{text.faqTitle}</h2>
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

function PartnerSection({ items, text }: { items: [string, string][]; text: typeof koreanContent.text }) {
  return (
    <section className="partner-section reveal">
      <div className="partner-copy">
        <p className="eyebrow">{text.togetherEyebrow}</p>
        <h2>{text.togetherTitle}</h2>
        <p>{text.togetherText}</p>
      </div>
      <div className="partner-list">
        {items.map(([title, copy]) => renderInfoCard(title, copy))}
      </div>
    </section>
  );
}

function Footer({ text }: { text: typeof koreanContent.text }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>{text.brand}</strong>
        <p>{text.footerText}</p>
      </div>
      <a href="#download">{text.download}</a>
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
