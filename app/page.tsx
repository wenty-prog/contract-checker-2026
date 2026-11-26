import Link from "next/link";
import { btnGhost, btnPrimary } from "@/components/ui";

// ───────────────────────────── 資料 ─────────────────────────────

const HIGHLIGHTS = [
  { label: "支援格式", value: "PDF · Word · TXT" },
  { label: "審查時間", value: "約 30–60 秒" },
  { label: "語境", value: "台灣法律・繁體中文" },
  { label: "金鑰", value: "BYOK・不經儲存" },
];

const FEATURES = [
  {
    no: "01",
    title: "逐條標出風險",
    body: "直接引用合約原文，依高、中、低三級標示對你不利、模糊或不合理的條款，並說明為什麼有風險。",
  },
  {
    no: "02",
    title: "提醒缺漏條款",
    body: "比對同類合約通常應有的保障，列出這份合約沒寫到、但你應該要求補上的條款。",
  },
  {
    no: "03",
    title: "給出替換文字",
    body: "不只說哪裡有問題，還提供可直接拿去和對方協商的修改方向與條款文字。",
  },
  {
    no: "04",
    title: "保留審查紀錄",
    body: "每一份審查報告與原始檔案都會保存在你的會員帳號下，只有你自己看得到。",
  },
];

const STEPS = [
  {
    title: "設定你的 API 金鑰",
    body: "貼上自己的 OpenAI API key，它只會存在你這台裝置的瀏覽器裡。",
  },
  {
    title: "上傳合約",
    body: "拖曳 PDF、Word 或純文字檔，4MB 以內。PDF 會保留排版與表格一起判讀。",
  },
  {
    title: "閱讀審查報告",
    body: "風險分數、風險條款、缺漏條款與整體建議，一頁看完，隨時回頭查閱。",
  },
];

const USE_CASES = ["租賃契約", "勞動契約", "軟體委託開發", "保密協議 NDA", "買賣契約", "合作備忘錄", "顧問服務合約", "授權合約"];

const FAQS = [
  {
    q: "什麼是 BYOK？為什麼要自己提供 API 金鑰？",
    a: "BYOK 是 Bring Your Own Key 的縮寫。審查會直接使用你自己的 OpenAI 帳戶額度，費用透明、由你掌控；我們不會替你保管金鑰，也不需要對你收取任何 AI 使用費。",
  },
  {
    q: "我的 API 金鑰會被儲存嗎？",
    a: "不會存在我們的伺服器或資料庫。金鑰只保存在你瀏覽器的 localStorage，每次審查時隨請求送出、用完即丟，也不會寫進伺服器紀錄。你可以隨時在「API 金鑰」頁面清除。",
  },
  {
    q: "審查一份合約大概要花多少費用？",
    a: "費用依合約長度與 OpenAI 當時的定價而定，一般的合約通常只需要幾分錢美金到數毛美金。實際用量可在 OpenAI 後台的 Usage 頁面查看。",
  },
  {
    q: "上傳的合約誰看得到？",
    a: "審查報告與原始檔案都綁定在你的會員帳號下，其他會員無法查看。合約內容會傳送給 OpenAI 進行分析，請依你的保密需求自行判斷是否上傳。",
  },
  {
    q: "AI 的審查結果可以取代律師嗎？",
    a: "不行。AI 審查能幫你快速掌握重點、找出需要注意的地方，但不構成法律意見。金額重大或情況複雜的合約，仍建議諮詢專業律師。",
  },
];

// ───────────────────────────── 區塊 ─────────────────────────────

// Hero 右側的「審查報告」示意圖（純裝飾，內容是範例）
function ReportPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:mx-0">
      {/* 後面那張紙 */}
      <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 rounded-[1.75rem] border border-line bg-paper-deep" />

      <div className="relative flex flex-col gap-5 rounded-[1.75rem] border border-line bg-surface p-6 shadow-lift sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-faint">審查報告・範例</span>
            <span className="font-serif text-lg font-semibold text-ink">房屋租賃契約書</span>
            <span className="text-xs text-muted">出租人 王○○・承租人 你</span>
          </div>
          {/* 像蓋章一樣的風險分數 */}
          <div className="flex size-20 shrink-0 rotate-[-8deg] flex-col items-center justify-center rounded-full border-2 border-seal text-seal">
            <span className="font-serif text-2xl leading-none font-bold">72</span>
            <span className="mt-0.5 text-[0.6rem] tracking-[0.2em]">高風險</span>
          </div>
        </div>

        <div className="h-px bg-line" />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">第 8 條・押金返還</span>
            <span className="rounded-full bg-seal-tint px-2.5 py-0.5 text-[0.65rem] font-medium text-seal">高風險</span>
          </div>
          <p className="border-l-2 border-seal/60 bg-paper/70 px-3 py-2 font-serif text-[0.8rem] leading-6 text-ink-soft">
            租期屆滿時，出租人得視房屋狀況<mark className="bg-seal-tint px-0.5 text-seal-hover">自行決定扣抵押金之金額</mark>
            ，承租人不得異議。
          </p>
          <p className="rounded-xl bg-jade-tint px-3 py-2 text-[0.78rem] leading-6 text-jade">
            建議改為：扣抵須檢附損壞照片與修繕單據，並於退租後 7 日內返還餘額。
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { n: "5", l: "風險條款" },
            { n: "3", l: "缺漏條款" },
            { n: "6", l: "修改建議" },
          ].map((item) => (
            <div key={item.l} className="rounded-xl border border-line bg-paper/50 py-2.5">
              <div className="font-serif text-lg font-semibold text-ink">{item.n}</div>
              <div className="text-[0.65rem] text-muted">{item.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-ruled pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-28">
        <div className="flex animate-rise flex-col gap-8">
          <span className="eyebrow inline-flex w-fit items-center gap-3 text-muted">
            <span className="h-px w-8 bg-seal" />
            AI Contract Review
          </span>
          <h1 className="font-serif text-[2.6rem] leading-[1.2] font-semibold tracking-tight text-ink sm:text-6xl sm:leading-[1.15]">
            簽名之前，
            <br />
            先讀懂<span className="relative whitespace-nowrap text-seal">每一條<span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-seal/30" /></span>。
          </h1>
          <p className="max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
            上傳合約，AI 以台灣執業律師的視角逐條審閱——標出對你不利的條款、提醒該補上的保障，並給你可以直接拿去協商的修改文字。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/review" className={btnPrimary}>
              開始審查合約
              <span aria-hidden>→</span>
            </Link>
            <a href="#how" className={btnGhost}>
              看看怎麼運作
            </a>
          </div>
          <p className="text-xs text-faint">使用你自己的 OpenAI API 金鑰・金鑰只存在你的瀏覽器</p>
        </div>
        <div className="animate-rise [animation-delay:150ms]">
          <ReportPreview />
        </div>
      </div>
    </section>
  );
}

function HighlightStrip() {
  return (
    <section className="border-y border-line bg-line">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5 bg-paper px-4 py-7 sm:px-6 md:px-8">
            <dt className="eyebrow text-faint">{item.label}</dt>
            <dd className="font-serif text-base font-semibold text-ink sm:text-lg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SectionHeading({ eyebrow, title, body, dark }: { eyebrow: string; title: string; body?: string; dark?: boolean }) {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <span className={`eyebrow inline-flex items-center gap-3 ${dark ? "text-night-muted" : "text-muted"}`}>
        <span className="h-px w-8 bg-seal" />
        {eyebrow}
      </span>
      <h2
        className={`font-serif text-3xl leading-snug font-semibold tracking-tight sm:text-4xl ${dark ? "text-night-text" : "text-ink"}`}
      >
        {title}
      </h2>
      {body && <p className={`leading-8 ${dark ? "text-night-muted" : "text-ink-soft"}`}>{body}</p>}
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        eyebrow="What it does"
        title="一份報告，看懂合約裡的每個陷阱"
        body="不是籠統的摘要，而是逐條引用原文、分級標示，並告訴你下一步該怎麼談。"
      />
      <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f.no} className="group flex flex-col gap-4 bg-surface p-8 transition-colors duration-500 hover:bg-paper sm:p-10">
            <span className="font-mono text-xs text-seal">{f.no}</span>
            <h3 className="font-serif text-xl font-semibold text-ink">{f.title}</h3>
            <p className="leading-7 text-ink-soft">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-night text-night-text">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-24 sm:px-6 md:py-32">
        <SectionHeading dark eyebrow="How it works" title="三個步驟，一分鐘內拿到報告" />
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex flex-col gap-4 border-t border-night-line pt-8">
              <span className="absolute -top-px left-0 h-px w-16 bg-seal" />
              <span className="font-serif text-5xl font-semibold text-night-line">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-serif text-xl font-semibold">{step.title}</h3>
              <p className="leading-7 text-night-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 rounded-full bg-night-text px-6 py-3 text-sm font-medium text-night transition-colors duration-300 hover:bg-surface"
          >
            從設定金鑰開始 <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 說明 BYOK 的資料流：瀏覽器 → 我們的伺服器（不儲存）→ OpenAI
function PrivacyFlow() {
  const nodes = [
    { title: "你的瀏覽器", note: "金鑰存在 localStorage" },
    { title: "審查伺服器", note: "只在本次請求中使用・不儲存" },
    { title: "OpenAI", note: "以你的帳戶額度計費" },
  ];
  return (
    <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
      {nodes.map((node, i) => (
        <div key={node.title} className="flex flex-col items-stretch gap-3 md:flex-1 md:flex-row md:items-center">
          <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-line bg-surface px-5 py-4">
            <span className="font-serif font-semibold text-ink">{node.title}</span>
            <span className="text-xs leading-5 text-muted">{node.note}</span>
          </div>
          {i < nodes.length - 1 && (
            <span aria-hidden className="self-center font-mono text-seal md:rotate-0">
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Privacy() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <SectionHeading
        eyebrow="Bring your own key"
        title="你的金鑰，只屬於你"
        body="審查使用你自己的 OpenAI API 金鑰。金鑰不會進入我們的資料庫，也不會寫進伺服器紀錄；費用直接由你的 OpenAI 帳戶計算，沒有任何中間加價。"
      />
      <div className={`flex flex-col gap-6 rounded-[1.75rem] border border-line bg-paper-deep/50 p-6 sm:p-8`}>
        <PrivacyFlow />
        <ul className="grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
          {["金鑰可隨時在設定頁清除", "審查報告只有本人看得到", "支援任何 sk- 開頭的 OpenAI 金鑰", "不需要訂閱，用多少付多少"].map(
            (item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-seal" />
                {item}
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className="border-y border-line bg-surface/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:gap-16">
        <p className="eyebrow shrink-0 text-muted">適用的合約類型</p>
        <ul className="flex flex-wrap gap-2.5">
          {USE_CASES.map((item) => (
            <li key={item} className="rounded-full border border-line-strong bg-surface px-4 py-2 font-serif text-sm text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1fr_1.6fr]">
      <SectionHeading eyebrow="FAQ" title="常見問題" />
      <div className="flex flex-col border-t border-line">
        {FAQS.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 font-serif text-lg font-semibold text-ink transition-colors hover:text-seal">
              {item.q}
              <span aria-hidden className="faq-icon shrink-0 font-sans text-2xl font-light text-muted transition-transform duration-300">
                +
              </span>
            </summary>
            <p className="pb-6 leading-8 text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-night px-6 py-20 text-center text-night-text">
        <div className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-seal/25 blur-3xl" />
        <h2 className="relative font-serif text-3xl leading-snug font-semibold sm:text-5xl">
          下一份合約，
          <br className="sm:hidden" />
          先讓 AI 讀過一遍。
        </h2>
        <p className="relative max-w-lg leading-8 text-night-muted">免費註冊，貼上你的 API 金鑰，就能開始審查。</p>
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <Link
            href="/review"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-seal px-7 py-3.5 text-sm font-medium text-surface transition-colors duration-300 hover:bg-seal-hover"
          >
            開始審查合約 <span aria-hidden>→</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-night-line px-7 py-3.5 text-sm font-medium text-night-text transition-colors duration-300 hover:border-night-muted"
          >
            建立免費帳號
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HighlightStrip />
      <Features />
      <HowItWorks />
      <Privacy />
      <UseCases />
      <Faq />
      <FinalCta />
    </>
  );
}
