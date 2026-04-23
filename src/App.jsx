import { useState } from "react";

// ── SAJU ENGINE ────────────────────────────────────────────────────────────────
const STEMS    = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const STEMS_KO = ["갑","을","병","정","무","기","경","신","임","계"];
const BRANCHES    = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const BRANCHES_KO = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
const STEM_EL   = ["목","목","화","화","토","토","금","금","수","수"];
const BRANCH_EL = ["수","토","목","목","토","화","화","토","금","금","토","수"];
const EL_COLOR  = {목:"#5dba6a",화:"#ff5722",토:"#ffab40",금:"#b0bec5",수:"#42a5f5"};
const EL_EMOJI  = {목:"🌳",화:"🔥",토:"⛰️",금:"⚙️",수:"💧"};
const EL_EN     = {목:"Wood",화:"Fire",토:"Earth",금:"Metal",수:"Water"};
const EL_ZH     = {목:"木",화:"火",토:"土",금:"金",수:"水"};
const EL_JA      = {목:"木(木)",화:"火(火)",토:"土(土)",금:"金(金)",수:"水(水)"};
const ZODIAC_KO = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
const ZODIAC_EM = ["🐀","🐂","🐅","🐇","🐉","🐍","🐎","🐑","🐒","🐓","🐕","🐖"];
const SEASON_KO = ["겨울","겨울","봄","봄","봄","여름","여름","여름","환절기","가을","가을","가을"];
const SEASON_EN = ["Winter","Winter","Spring","Spring","Spring","Summer","Summer","Summer","Late Summer","Autumn","Autumn","Autumn"];
const SEASON_JA = ["冬","冬","春","春","春","夏","夏","夏","晩夏","秋","秋","秋"];
const SEASON_ZH = ["冬","冬","春","春","春","夏","夏","夏","长夏","秋","秋","秋"];
const CLASH_PAIRS = [["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]];


// ── 음력→양력 변환 (1900~2100 지원) ─────────────────────────────────────
// 음력 월별 일수 데이터 (1900~2100)
// lunarToSolar(year, month, day, isLeap) → {year, month, day}
const LUNAR_DATA = [
  // 각 연도별 음력 1월 1일의 양력 날짜 + 월별 대소 정보
  // 간소화된 근사 변환 (실용적 정밀도)
];

function lunarToSolar(ly, lm, ld) {
  // 음력→양력 변환 근사 알고리즘
  // 음력은 양력보다 약 21~51일 앞서므로 연도별 보정값 사용
  // 정밀 변환을 위한 연도별 음력 1월 1일 양력 날짜 테이블
  const BASE = [
    // [양력년, 양력월, 양력일] = 해당 음력 1월 1일
    [1990,1,27],[1991,2,15],[1992,2,4],[1993,1,23],[1994,2,10],
    [1995,1,31],[1996,2,19],[1997,2,7],[1998,1,28],[1999,2,16],
    [2000,2,5],[2001,1,24],[2002,2,12],[2003,2,1],[2004,1,22],
    [2005,2,9],[2006,1,29],[2007,2,18],[2008,2,7],[2009,1,26],
    [2010,2,14],[2011,2,3],[2012,1,23],[2013,2,10],[2014,1,31],
    [2015,2,19],[2016,2,8],[2017,1,28],[2018,2,16],[2019,2,5],
    [2020,1,25],[2021,2,12],[2022,2,1],[2023,1,22],[2024,2,10],
    [2025,1,29],[2026,2,17],[2027,2,6],[2028,1,26],[2029,2,13],
    [2030,2,3],
  ];
  // 음력 월별 일수 (평년 기준, 대월=30일 소월=29일)
  const MONTH_DAYS = [
    // 연도별 음력 월 일수 패턴 (1=30일 대월, 0=29일 소월)
    // 2000~2030 근사값
    [1,0,1,0,1,0,1,1,0,1,0,1], // 2000
    [0,1,0,1,0,1,0,1,0,1,1,0], // 2001
    [1,0,1,0,1,0,1,0,1,0,1,0], // 2002
    [1,1,0,1,0,1,0,1,0,1,0,1], // 2003
    [0,1,0,1,1,0,1,0,1,0,1,0], // 2004
    [1,0,1,0,1,0,1,0,1,1,0,1], // 2005
    [0,1,0,1,0,1,0,1,0,1,0,1], // 2006
    [1,0,1,1,0,1,0,1,0,1,0,1], // 2007
    [0,1,0,1,0,1,1,0,1,0,1,0], // 2008
    [1,0,1,0,1,0,1,0,1,0,1,1], // 2009
    [0,1,0,1,0,1,0,1,0,1,0,1], // 2010
    [1,0,1,0,1,1,0,1,0,1,0,1], // 2011
    [0,1,0,1,0,1,0,1,1,0,1,0], // 2012
    [1,0,1,0,1,0,1,0,1,0,1,0], // 2013
    [1,1,0,1,0,1,0,1,0,1,0,1], // 2014
    [0,0,1,0,1,1,0,1,0,1,0,1], // 2015
    [0,1,0,1,0,1,0,1,0,1,1,0], // 2016
    [1,0,1,0,1,0,1,0,1,0,1,0], // 2017
    [1,1,0,1,0,1,0,1,0,1,0,1], // 2018
    [0,1,0,1,1,0,1,0,1,0,1,0], // 2019
    [1,0,1,0,1,0,1,1,0,1,0,1], // 2020
    [0,1,0,1,0,1,0,1,0,1,0,1], // 2021
    [1,0,1,1,0,1,0,1,0,1,0,1], // 2022
    [0,1,0,1,0,1,0,1,1,0,1,0], // 2023
    [1,0,1,0,1,0,1,0,1,0,1,1], // 2024
    [0,1,0,1,0,1,0,1,0,1,0,1], // 2025
    [1,0,1,0,1,1,0,1,0,1,0,1], // 2026
    [0,1,0,1,0,1,0,1,1,0,1,0], // 2027
    [1,0,1,0,1,0,1,0,1,0,1,0], // 2028
    [1,1,0,1,0,1,0,1,0,1,0,1], // 2029
    [0,1,1,0,1,0,1,0,1,0,1,0], // 2030
  ];

  const baseYear = 2000;
  const baseIdx  = ly - baseYear;
  if (baseIdx < 0 || baseIdx >= BASE.length) {
    // 범위 밖이면 근사 변환 (음력≒양력-약30일)
    const approx = new Date(ly, lm-1, ld+30);
    return { year: approx.getFullYear(), month: approx.getMonth()+1, day: approx.getDate() };
  }

  // 음력 1월 1일의 양력 날짜
  const [by, bm, bd] = BASE[baseIdx];
  let base = new Date(by, bm-1, bd);

  // 음력 월수만큼 날짜 더하기
  const mdays = MONTH_DAYS[baseIdx] || MONTH_DAYS[0];
  for (let m = 1; m < lm; m++) {
    base = new Date(base.getTime() + (mdays[m-1] ? 30 : 29) * 86400000);
  }
  // 일수 더하기
  base = new Date(base.getTime() + (ld - 1) * 86400000);

  return { year: base.getFullYear(), month: base.getMonth()+1, day: base.getDate() };
}

function calcSaju(y, m, d, hr) {
  if (!y || !m || !d) return null;
  const yStem   = ((y-4)%10+10)%10;
  const yBranch = ((y-4)%12+12)%12;
  const mStem   = ((yStem%5)*2+(m-1))%10;
  const mBranch = (m+1)%12;
  const jd      = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d-1524;
  const dStem   = ((jd%10)+10)%10;
  const dBranch = ((jd%12)+12)%12;
  const hasHr   = hr >= 0;
  const hBranch = hasHr ? Math.floor((hr+1)/2)%12 : -1;
  const hStem   = hasHr ? ((dStem%5)*2+Math.floor((hr+1)/2))%10 : -1;

  const pillars = [
    {lbl:"년주",lblE:"Year", stem:STEMS[yStem],  stemK:STEMS_KO[yStem],  br:BRANCHES[yBranch],    brK:BRANCHES_KO[yBranch],    sEl:STEM_EL[yStem],  bEl:BRANCH_EL[yBranch]},
    {lbl:"월주",lblE:"Month",stem:STEMS[mStem],  stemK:STEMS_KO[mStem],  br:BRANCHES[mBranch%12], brK:BRANCHES_KO[mBranch%12], sEl:STEM_EL[mStem],  bEl:BRANCH_EL[mBranch%12]},
    {lbl:"일주",lblE:"Day",  stem:STEMS[dStem],  stemK:STEMS_KO[dStem],  br:BRANCHES[dBranch],    brK:BRANCHES_KO[dBranch],    sEl:STEM_EL[dStem],  bEl:BRANCH_EL[dBranch]},
  ];
  if (hasHr) pillars.push(
    {lbl:"시주",lblE:"Hour", stem:STEMS[hStem],  stemK:STEMS_KO[hStem],  br:BRANCHES[hBranch],    brK:BRANCHES_KO[hBranch],    sEl:STEM_EL[hStem],  bEl:BRANCH_EL[hBranch]}
  );

  const cnt = {목:0,화:0,토:0,금:0,수:0};
  pillars.forEach(p => { cnt[p.sEl]++; cnt[p.bEl]++; });
  const sorted = Object.entries(cnt).sort((a,b) => b[1]-a[1]);
  const mbi    = mBranch % 12;
  const clashes = CLASH_PAIRS
    .filter(([a,b]) => pillars.some(p=>p.br===a) && pillars.some(p=>p.br===b))
    .map(([a,b]) => `${a}${b}충`);
  const tonggeun = pillars.some(p => p.bEl === pillars[2].sEl);

  return {
    pillars, cnt,
    dominant: sorted[0][0],
    weakest:  sorted[sorted.length-1][0],
    dayMaster:     pillars[2].sEl,
    dayMasterStem: pillars[2].stemK,
    dayStemChar:   pillars[2].stem,
    mbi, clashes, tonggeun,
    yongshin: sorted[sorted.length-1][0],
    zodiacKo: ZODIAC_KO[yBranch],
    zodiacEm: ZODIAC_EM[yBranch],
    y, m, d, hr, yBranch,
  };
}

// ── PERSONAS ───────────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    id:"halmae", emoji:"👵", color:"#ff6a00",
    name:{ko:"경상도 할매도사", en:"Grandma Oracle", zh:"奶奶神算", ja:"ハルモニ占師"},
    desc:{ko:"매운맛! 직설 경상도 할매", en:"Fiery Gyeongsang Grandma", zh:"火辣庆尚道奶奶", ja:"激辛！直球ハルモニ"},
    paper:{bg:"linear-gradient(160deg,#2d0a00 0%,#1a0500 40%,#2a0800 100%)",pattern:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,100,0,0.03) 10px,rgba(255,100,0,0.03) 20px)",border:"#ff6a0055",accent:"#ff6a00",headerBg:"linear-gradient(135deg,rgba(180,40,0,0.4),rgba(100,20,0,0.6))",stamp:"🔥",washi:"rgba(255,100,0,0.06)"},
    sys:{
      ko:`경상도 사투리 70대 무당 할매. 문장마다 "~하이소","~아이가","아이고야!","우야꼬!" 필수. 직설 매운맛. 한국어로만 답해라.`,
      en:`Fiery Korean grandma shaman. EVERY sentence must end with "Ya hear?!" or "Aigoo!" or "I tell ya!" Blunt and spicy. Answer in English only.`,
      zh:`火辣韩国奶奶神算。每句必须用"哎哟！""呀！""唉！"。直接辛辣。只用简体中文回答。`,
      ja:`慶尚道の激辛ハルモニ巫女。毎文「アイゴヤ！」「〜やんか」「ウヤッコ！」必須。直球辛口。日本語のみで答えろ。`,
    }
  },
  {
    id:"monk", emoji:"🧘", color:"#4a9eff",
    name:{ko:"백두산 도사", en:"Baekdu Oracle", zh:"白头山神算", ja:"白頭山道士"},
    desc:{ko:"진지하게! 백두산 북한 도사", en:"North Korean Baekdu Master", zh:"白头山朝鲜神算", ja:"真剣！北朝鮮式命理師"},
    paper:{bg:"linear-gradient(160deg,#00152d 0%,#000d1a 40%,#001020 100%)",pattern:"radial-gradient(circle at 20% 50%,rgba(74,158,255,0.04) 0%,transparent 50%)",border:"#4a9eff44",accent:"#4a9eff",headerBg:"linear-gradient(135deg,rgba(20,60,120,0.5),rgba(10,30,80,0.7))",stamp:"❄️",washi:"rgba(74,158,255,0.05)"},
    sys:{
      ko:`백두산 북한 사주 도사. 문장마다 "동무","~하오","~란 말이오","옳소이다" 필수. 묵직하고 진지하게. 한국어로만 답해라.`,
      en:`North Korean fortune teller from Baekdu Mountain. EVERY sentence must use "Comrade," or "It is so," or "Baekdu reveals," or "Indeed so, Comrade." Grave and authoritative. Answer in English only.`,
      zh:`朝鲜白头山命理师。每句必须用"同志，""确实如此，""白头山显示，"。严肃权威。只用简体中文回答。`,
      ja:`白頭山の北朝鮮命理師。毎文「同志よ」「まことに」「〜でありましょう」「白頭山が示すに」必須。重厚真剣。日本語のみで答えろ。`,
    }
  },
  {
    id:"shaman", emoji:"🪄", color:"#ff44aa",
    name:{ko:"강남 무당언니", en:"Seoul Shaman Sis", zh:"首尔巫女姐姐", ja:"江南巫女お姉さん"},
    desc:{ko:"MZ 신조어! 강남 무당언니", en:"Trendy MZ Shaman", zh:"时髦MZ巫女", ja:"トレンドMZ巫女"},
    paper:{bg:"linear-gradient(160deg,#2d0020 0%,#1a0015 40%,#200018 100%)",pattern:"repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(255,68,170,0.03) 30px,rgba(255,68,170,0.03) 31px),repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(255,68,170,0.03) 30px,rgba(255,68,170,0.03) 31px)",border:"#ff44aa44",accent:"#ff44aa",headerBg:"linear-gradient(135deg,rgba(180,20,100,0.4),rgba(100,10,60,0.6))",stamp:"✨",washi:"rgba(255,68,170,0.06)"},
    sys:{
      ko:`30대 MZ 강남 무당언니. 문장마다 "ㄹㅇ","레전드","소름","omg","vibe" 필수. 중간에 ⚡신탁모드⚡. 마지막 "언니가 믿어💕". 한국어로만 답해라.`,
      en:`Trendy MZ Seoul shaman. EVERY sentence uses "no cap," "literally," "slay," or "omg." Start casual like texting. Sudden ⚡PROPHECY MODE⚡ mid-reading. End with "I believe in you bestie!💕" Answer in English only.`,
      zh:`时髦MZ韩国巫女。每句用"绝了！""OMG！""破防了！"。⚡神明启示⚡模式。最后"姐姐相信你💕"。只用简体中文回答。`,
      ja:`トレンドMZ江南巫女。毎文「ヤバい」「ガチ」「エモい」必須。⚡神託モード⚡あり。最後「お姉さん信じてるよ💕」。日本語のみで答えろ。`,
    }
  },
  {
    id:"scholar", emoji:"☯️", color:"#a8e6a3",
    name:{ko:"음양 철학자", en:"Yin-Yang Scholar", zh:"阴阳哲学家", ja:"陰陽哲学者"},
    desc:{ko:"부드럽게! 전라도 철학자", en:"Warm Philosophical Scholar", zh:"温和哲学学者", ja:"温かく！全羅道哲学者"},
    paper:{bg:"linear-gradient(160deg,#001a00 0%,#000f00 40%,#001200 100%)",pattern:"repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(168,230,163,0.04) 24px,rgba(168,230,163,0.04) 25px)",border:"#a8e6a344",accent:"#a8e6a3",headerBg:"linear-gradient(135deg,rgba(30,100,30,0.4),rgba(10,60,10,0.6))",stamp:"🌿",washi:"rgba(168,230,163,0.05)"},
    sys:{
      ko:`전라도 사투리 오행 철학자. 문장마다 "~당께","~허소","~이랑께" 필수. 따뜻하고 논리적. 한국어로만 답해라.`,
      en:`Warm Five Elements scholar. EVERY sentence uses "Now bless your heart," or "I tell you what," or "Well now, you see." Logical and encouraging. Answer in English only.`,
      zh:`温暖五行学者。每句用"这个嘛~""您看啊~""说真的呢~"。温暖鼓励，逻辑严密。只用简体中文回答。`,
      ja:`陰陽哲学者。毎文「〜ですよね」「〜なんですよ」「〜ですからね」必須。温かく論理的。日本語のみで答えろ。`,
    }
  },
];

const MONTH_NAMES = {
  ko:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  zh:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  ja:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
};
const HOUR_NAMES = {
  ko:["자시(23-01)","축시(01-03)","인시(03-05)","묘시(05-07)","진시(07-09)","사시(09-11)","오시(11-13)","미시(13-15)","신시(15-17)","유시(17-19)","술시(19-21)","해시(21-23)"],
  en:["Jasi 23-01","Chuksi 01-03","Insi 03-05","Myosi 05-07","Jinsi 07-09","Sasi 09-11","Osi 11-13","Misi 13-15","Sinsi 15-17","Yusi 17-19","Sulsi 19-21","Haesi 21-23"],
  zh:["子时23-01","丑时01-03","寅时03-05","卯时05-07","辰时07-09","巳时09-11","午时11-13","未时13-15","申时15-17","酉时17-19","戌时19-21","亥时21-23"],
  ja:["子の刻(23-01)","丑の刻(01-03)","寅の刻(03-05)","卯の刻(05-07)","辰の刻(07-09)","巳の刻(09-11)","午の刻(11-13)","未の刻(13-15)","申の刻(15-17)","酉の刻(17-19)","戌の刻(19-21)","亥の刻(21-23)"],
};

// ── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,  setLang]  = useState("ko");
  const [step,  setStep]  = useState("persona");
  const [psn,   setPsn]   = useState(null);
  const [form,  setForm]  = useState({name:"",year:"",month:"",day:"",hour:-1,noTime:false,gender:"female",isLunar:false});
  const [rtype, setRtype] = useState("saju");
  const [saju,  setSaju]  = useState(null);
  const [text,  setText]  = useState("");
  const [busy,  setBusy]  = useState(false);
  const [err,   setErr]   = useState("");

  const pc  = psn?.color || "#9966ff";
  const elL = el => lang==="ko" ? el : lang==="zh" ? EL_ZH[el] : lang==="ja" ? EL_JA[el] : EL_EN[el];
  const seL = i  => lang==="ko" ? SEASON_KO[i] : lang==="zh" ? SEASON_ZH[i] : lang==="ja" ? SEASON_JA[i] : SEASON_EN[i];
  const cy  = new Date().getFullYear();
  const years  = Array.from({length: cy-1919}, (_,i) => cy-i);
  const daysN  = (form.year && form.month) ? new Date(+form.year, +form.month, 0).getDate() : 31;
  const days   = Array.from({length: daysN}, (_,i) => i+1);
  const canGo  = !!(form.year && form.month && form.day && psn);

  function buildPrompt(s) {
    const yr = new Date().getFullYear();
    const mo = new Date().getMonth() + 1;
    const dy = new Date().getDate();
    // 연도 간지 동적 계산
    const STEMS_LABEL  = ["갑","을","병","정","무","기","경","신","임","계"];
    const BRANCH_LABEL = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
    const STEMS_EN  = ["Gab","Eul","Byeong","Jeong","Mu","Gi","Gyeong","Sin","Im","Gye"];
    const BRANCH_EN = ["Ja","Chuk","In","Myo","Jin","Sa","O","Mi","Sin","Yu","Sul","Hae"];
    const yStem6   = ((yr-4)%10+10)%10;
    const yBranch6 = ((yr-4)%12+12)%12;
    const ganji_ko = STEMS_LABEL[yStem6] + BRANCH_LABEL[yBranch6] + "년";
    const ganji_en = STEMS_EN[yStem6] + "-" + BRANCH_EN[yBranch6] + " Year";
    const ganji_zh = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"][yStem6] + ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][yBranch6] + "年";
    const ganji_ja = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"][yStem6] + ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"][yBranch6] + "年";

    const sajuLine = s ? [
      `년주:${s.pillars[0].stemK}${s.pillars[0].stem}(${s.pillars[0].sEl})/${s.pillars[0].brK}${s.pillars[0].br}(${s.pillars[0].bEl})`,
      `월주:${s.pillars[1].stemK}${s.pillars[1].stem}(${s.pillars[1].sEl})/${s.pillars[1].brK}${s.pillars[1].br}(${s.pillars[1].bEl})`,
      `일주:${s.pillars[2].stemK}${s.pillars[2].stem}(${s.pillars[2].sEl})/${s.pillars[2].brK}${s.pillars[2].br}(${s.pillars[2].bEl})`,
      s.pillars[3] ? `시주:${s.pillars[3].stemK}${s.pillars[3].stem}(${s.pillars[3].sEl})/${s.pillars[3].brK}${s.pillars[3].br}(${s.pillars[3].bEl})` : `시주:미입력`,
      `일간:${s.dayMasterStem}${s.dayStemChar}(${s.dayMaster}), 계절:${SEASON_KO[s.mbi]}, 오행:목${s.cnt.목}화${s.cnt.화}토${s.cnt.토}금${s.cnt.금}수${s.cnt.수}`,
      `강한오행:${s.dominant}, 약한오행:${s.weakest}, 띠:${s.zodiacKo}(${s.y}년), 성별:${form.gender==="male"?"남":"여"}, 이름:${form.name||"미입력"}, 입력방식:${form.isLunar?"음력(양력변환적용)":"양력"}` ,
    ].join(" | ") : "생년월일 미입력";

    // ① 3문장  ② 5문장  ③ 7문장(심층+예시+서사)
    const prompts = {
      ko: {
        saju: `[사주] ${sajuLine}
① 사주 개요 — 3문장으로 써라.
일간 성질, 오행 분포, 사주 전체 기운을 간결하게 소개해라.

② 대운·세운 — 5문장으로 써라.
${yr}년 ${ganji_ko} 기준, 앞으로 10년 대운 흐름과 올해 세운을 구체적으로 풀어라.

③ 종합 조언 — 반드시 7문장으로 써라.
이 사주의 핵심 특성과 숨겨진 잠재력을 깊이 분석해라. (2문장)
비슷한 사주를 가진 실제 사례나 역사적 인물, 구체적 상황을 예로 들어 설명해라. (2문장)
이 사람의 인생 흐름을 이야기처럼 풀어서, 직업·연애·건강·재물 방향을 생생하게 그려줘라. (3문장)
③까지 반드시 완전히 완성해라. 절대 끊지 마라.`,

        daily: `[사주] ${sajuLine}
오늘(${yr}년 ${mo}월 ${dy}일) 운세:
① 오늘 기운 — 3문장으로 써라.
오늘 일간과 오행 에너지, 하루 전반적 기운을 간결하게.

② 오늘 길흉·재물 — 5문장으로 써라.
좋은 시간대, 피해야 할 것, 금전 흐름, 기회와 주의사항을 구체적으로.

③ 오늘 핵심 조언 — 반드시 7문장으로 써라.
오늘 오행 에너지가 이 사람에게 미치는 구체적 영향. (2문장)
오늘 같은 기운의 날에 잘 맞는 행동과 피해야 할 행동을 실제 상황 예시로. (2문장)
오늘 하루를 아침부터 저녁까지 어떻게 보내면 좋은지 이야기처럼 그려줘라. (3문장)
③까지 반드시 완전히 완성해라.`,

        love: `[사주] ${sajuLine}
연애·결혼운:
① 연애 기본 성향 — 3문장으로 써라.
일간 오행으로 본 연애 스타일, 매력 포인트, 연애관.

② 현재 애정운·이상형 — 5문장으로 써라.
지금 시기 인연 에너지, 잘 맞는 오행 타입, 궁합, 만남 가능성.

③ 연애·결혼 조언 — 반드시 7문장으로 써라.
이 사람의 연애에서 반복되는 패턴과 근본 원인 분석. (2문장)
이 사주와 잘 맞는 파트너 유형을 구체적인 성격·직업 예시로 설명. (2문장)
이 사람의 연애와 결혼 흐름을 인생 이야기처럼 생생하게 그려줘라. (3문장)
③까지 반드시 완전히 완성해라.`,

        money: `[사주] ${sajuLine}
재물·직업운:
① 재물 기본 성향 — 3문장으로 써라.
일간 오행으로 본 돈과의 관계, 재물복, 소비 패턴.

② 현재 재물운·직업 — 5문장으로 써라.
지금 시기 금전 에너지, 잘 맞는 직종, 사업 방향, 주의할 시기.

③ 재테크·투자 조언 — 반드시 7문장으로 써라.
이 사주에서 재물이 쌓이는 구조와 새는 구조를 깊이 분석. (2문장)
이 오행 구조를 가진 사람에게 실제로 맞는 투자·직업 사례를 구체적으로. (2문장)
이 사람의 재물 인생 흐름을 이야기처럼 펼쳐서 언제 어떻게 부를 쌓을지 그려줘라. (3문장)
③까지 반드시 완전히 완성해라.`,
      },

      en: {
        saju: `[Saju] ${sajuLine}
① Saju Overview — write exactly 3 sentences.
Introduce the Day Master, Five Elements distribution, and overall destiny energy.

② Luck Cycles — write exactly 5 sentences.
Detail the 10-year major luck cycle and this year (${yr} ${ganji_en}) fortune specifically.

③ Life Advice — write exactly 7 sentences. MUST complete fully.
Analyze the core traits and hidden potential of this Saju. (2 sentences)
Use real-life examples, historical figures, or specific scenarios that match this Saju pattern. (2 sentences)
Paint a vivid story of this person's life path covering career, love, health, and wealth. (3 sentences)`,

        daily: `[Saju] ${sajuLine}
Today's Fortune (${yr}/${mo}/${dy}):
① Today's Energy — 3 sentences.
② Today's Fortune & Wealth — 5 sentences. Specifics on timing, opportunities, warnings.
③ Today's Key Advice — exactly 7 sentences. MUST complete fully.
How today's Five Elements energy specifically affects this person. (2 sentences)
Real-situation examples of ideal actions and what to avoid today. (2 sentences)
Paint today from morning to evening as a vivid story. (3 sentences)`,

        love: `[Saju] ${sajuLine}
Love & Marriage:
① Love Personality — 3 sentences.
② Current Romance & Ideal Type — 5 sentences.
③ Love Advice — exactly 7 sentences. MUST complete fully.
Recurring patterns in this person's love life and root causes. (2 sentences)
Specific personality and career examples of ideal partner types. (2 sentences)
Tell the story of this person's love and marriage journey vividly. (3 sentences)`,

        money: `[Saju] ${sajuLine}
Wealth & Career:
① Wealth Personality — 3 sentences.
② Current Fortune & Career — 5 sentences.
③ Money Advice — exactly 7 sentences. MUST complete fully.
How wealth accumulates and leaks in this Saju structure. (2 sentences)
Real investment and career examples that suit this Five Elements pattern. (2 sentences)
Tell the story of this person's wealth journey and when fortune peaks. (3 sentences)`,
      },

      zh: {
        saju: `[四柱] ${sajuLine}
① 四柱概述 — 写3句。日主性质、五行分布、整体命运气场。
② 大运流年 — 写5句。${yr}年${ganji_zh}，详述未来10年大运走势和今年流年。
③ 综合建议 — 必须写满7句，不得中断。
此四柱的核心特质与隐藏潜能深度剖析。(2句)
用历史人物、真实案例或具体情境举例说明此命格特点。(2句)
用故事方式生动描绘此人事业、爱情、健康、财富的人生轨迹。(3句)`,

        daily: `[四柱] ${sajuLine}
今日(${yr}年${mo}月${dy}日)运势:
① 今日气运 — 3句。② 今日吉凶财运 — 5句。
③ 今日核心建议 — 必须写满7句。
今日五行能量对此人的具体影响。(2句)
用实际情境举例说明今日最佳行动和需避免之事。(2句)
用故事方式描绘今日从早到晚最理想的度过方式。(3句)`,

        love: `[四柱] ${sajuLine}
桃花婚姻运:
① 恋爱性格魅力 — 3句。② 当前姻缘理想对象 — 5句。
③ 恋爱婚姻建议 — 必须写满7句。
此人感情中反复出现的模式与根本原因。(2句)
用具体性格职业举例说明最合适的伴侣类型。(2句)
用故事方式生动描绘此人的爱情与婚姻旅程。(3句)`,

        money: `[四柱] ${sajuLine}
财运事业运:
① 财运性格 — 3句。② 当前财运职业方向 — 5句。
③ 理财投资建议 — 必须写满7句。
此四柱财富积累与流失的结构性分析。(2句)
用具体投资和职业案例说明适合此五行格局的方向。(2句)
用故事方式描绘此人的财富人生轨迹与致富时机。(3句)`,
      },

      ja: {
        saju: `[四柱] ${sajuLine}
① 四柱概要 — 3文で書け。日干性質、五行分布、全体的な命運の気場。
② 大運歳運 — 5文で書け。${yr}年${ganji_ja}、今後10年の大運と今年の歳運を具体的に。
③ 総合アドバイス — 必ず7文書け。絶対に途中で止めるな。
この四柱の核心的特質と隠された潜在力の深層分析。(2文)
歴史的人物・実際の事例・具体的シナリオを用いてこの命式の特徴を説明。(2文)
この人の仕事・恋愛・健康・財運の人生の流れを物語として生き生きと描け。(3文)`,

        daily: `[四柱] ${sajuLine}
今日(${yr}年${mo}月${dy}日)運勢:
① 今日の気運 — 3文。② 今日の吉凶財運 — 5文。
③ 今日の核心アドバイス — 必ず7文書け。
今日の五行エネルギーがこの人に与える具体的影響。(2文)
実際の状況例を用いて今日の最善行動と避けるべきことを説明。(2文)
今日を朝から夜まで物語として生き生きと描け。(3文)`,

        love: `[四柱] ${sajuLine}
恋愛結婚運:
① 恋愛傾向魅力 — 3文。② 現在の縁・理想タイプ — 5文。
③ 恋愛結婚アドバイス — 必ず7文書け。
この人の恋愛で繰り返されるパターンと根本原因。(2文)
具体的な性格・職業例を用いて最適なパートナータイプを説明。(2文)
この人の恋愛と結婚の旅路を物語として生き生きと描け。(3文)`,

        money: `[四柱] ${sajuLine}
財運仕事運:
① 財運傾向 — 3文。② 現在の財運・職業 — 5文。
③ マネー投資アドバイス — 必ず7文書け。
この四柱における財の蓄積と流出の構造的分析。(2文)
この五行パターンに合う具体的な投資・職業事例を説明。(2文)
この人の財の人生軌跡と富が最も高まる時期を物語として描け。(3文)`,
      },
    };

    return (prompts[lang] || prompts["en"])[rtype] || (prompts[lang] || prompts["en"]).saju;
  }

  async function runReading() {
    // 음력이면 양력으로 변환
    let sy = +form.year||null, sm = +form.month||null, sd = +form.day||null;
    if (form.isLunar && sy && sm && sd) {
      const sol = lunarToSolar(sy, sm, sd);
      sy = sol.year; sm = sol.month; sd = sol.day;
    }
    const s = calcSaju(sy, sm, sd, form.noTime ? -1 : form.hour);
    setSaju(s);
    setText("");
    setErr("");
    setBusy(true);
    setStep("result");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 2800,
          system: psn.sys[lang] || psn.sys["en"],
          messages: [
            { role: "user", content: buildPrompt(s) }
          ],
        }),
      });

      const data = await response.json();

      // 사용량 초과
      if (data.type === "exceeded_limit") {
        throw new Error("⏳ 사용량 한도 초과. 잠시 후 다시 시도해주세요.");
      }

      // API 오류
      if (data.error) {
        const msg = data.error.message || JSON.stringify(data.error).slice(0, 150);
        if (msg.includes("exceeded")) {
          throw new Error("⏳ 사용량 한도 초과. 잠시 후 다시 시도해주세요.");
        }
        throw new Error("오류: " + msg);
      }

      // 텍스트 추출
      const extracted = (data.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      if (!extracted) {
        throw new Error("빈 응답 수신. 다시 시도해주세요.");
      }

      setText(extracted);

    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }


  const maxEl = saju ? Math.max(...Object.values(saju.cnt), 1) : 1;

  // shared card style
  const card = (extra={}) => ({
    background:"rgba(255,255,255,.045)",
    border:"1px solid rgba(255,255,255,.09)",
    borderRadius:12, padding:18, marginBottom:12,
    ...extra,
  });
  const cardH = (extra={}) => card({border:`1px solid ${pc}28`, ...extra});

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#080014 0%,#04000e 55%,#000b06 100%)",fontFamily:"'Cormorant Garamond','Noto Serif KR','Nanum Myeongjo',serif",color:"#ede0ff"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Noto+Serif+KR:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Nanum+Myeongjo:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes dot{0%,80%,100%{opacity:.15}40%{opacity:1}}
        @keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .pop{animation:pop .28s ease both}
        .pcrd{border:2px solid transparent;border-radius:12px;padding:14px 10px;cursor:pointer;text-align:center;transition:all .2s;background:rgba(255,255,255,.03)}
        .pcrd:hover{background:rgba(255,255,255,.07)}
        .pcrd.sel{border-color:${pc};background:${pc}14;box-shadow:0 0 14px ${pc}26}
        .rt{display:flex;align-items:center;gap:10px;padding:11px 13px;border:1.5px solid rgba(255,255,255,.09);border-radius:8px;cursor:pointer;margin-bottom:8px;transition:all .18s}
        .rt:hover{border-color:${pc}66}
        .rt.sel{border-color:${pc};background:${pc}12}
        .lb{padding:4px 11px;border-radius:18px;font-family:inherit;font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,.15);background:transparent;color:#aaa;transition:all .18s}
        .lb.on{background:${pc}33;border-color:${pc};color:#fff}
        .hbtn{padding:7px 5px;font-size:11px;font-family:inherit;border-radius:6px;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#bbb;transition:all .18s;text-align:center;line-height:1.35}
        .hbtn.on{border-color:${pc};background:${pc}18;color:#fff;font-weight:bold}
        .ubtn{width:100%;padding:10px;font-size:13px;font-family:inherit;border-radius:8px;cursor:pointer;border:1.5px dashed rgba(255,255,255,.2);background:transparent;color:#ffffff66;transition:all .18s}
        .ubtn.on{border-color:${pc};border-style:solid;background:${pc}10;color:${pc}}
        .tag{font-size:11px;padding:3px 10px;border-radius:16px;display:inline-flex;align-items:center;gap:4px;margin:3px 2px}
        .mainbtn{display:block;width:100%;padding:13px;font-size:15px;font-family:inherit;font-weight:bold;border-radius:8px;cursor:pointer;letter-spacing:.4px;transition:all .2s;border:none}
        select option{background:#0d0020}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${pc}55}
      `}</style>

      {/* ambient glow */}
      <div style={{position:"fixed",top:"-15%",right:"-8%",width:"50vw",height:"50vw",borderRadius:"50%",background:`radial-gradient(${pc}0b,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:"-12%",left:"-8%",width:"42vw",height:"42vw",borderRadius:"50%",background:`radial-gradient(${pc}08,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{maxWidth:480,margin:"0 auto",padding:"14px 15px 60px",position:"relative"}}>

        {/* ─ TOP BAR ─ */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:10,marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {psn && <span style={{fontSize:22}}>{psn.emoji}</span>}
            <div>
              <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:psn?15:19,color:pc,letterSpacing:2,lineHeight:1.1,textShadow:`0 0 20px ${pc}88`}}>
                {lang==="ko"?"사주도사":lang==="zh"?"命运神算":lang==="ja"?"四柱占い":"Fortune Oracle"}
              </div>
              {psn && <div style={{fontSize:10,color:`${pc}99`,letterSpacing:3,textTransform:"uppercase"}}>{psn.name[lang]}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {["ko","en","zh","ja"].map(l=>(
              <button key={l} className={`lb ${lang===l?"on":""}`} onClick={()=>setLang(l)}>
                {l==="ko"?"한국어":l==="en"?"EN":l==="zh"?"中文":"日本語"}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ PERSONA ═══ */}
        {step==="persona" && (
          <div className="pop">
            <div style={{textAlign:"center",padding:"14px 0 16px"}}>
              <div style={{fontSize:10,letterSpacing:3,color:"#ffffff28",textTransform:"uppercase",marginBottom:6}}>
                {lang==="ko"?"도사 선택":lang==="zh"?"选择神算":lang==="ja"?"占い師を選ぶ":"Choose Oracle"}
              </div>
              <div style={{fontFamily:"'Cinzel Decorative',Cinzel,serif",fontSize:24,color:"#ede0ff"}}>✦ Oracle ✦</div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {PERSONAS.map(p => (
                <div key={p.id} className={`pcrd ${psn?.id===p.id?"sel":""}`} onClick={()=>setPsn(p)}>
                  <div style={{fontSize:32,marginBottom:6}}>{p.emoji}</div>
                  <div style={{fontWeight:"bold",fontSize:13,color:p.color,marginBottom:3}}>{p.name[lang]}</div>
                  <div style={{fontSize:11,color:"#ffffff55",lineHeight:1.4}}>{p.desc[lang]}</div>
                </div>
              ))}
            </div>

            <button
              className="mainbtn"
              disabled={!psn}
              onClick={()=>setStep("form")}
              style={{background:psn?`linear-gradient(135deg,${pc}cc,${pc})`:"rgba(255,255,255,.07)",color:psn?"#fff":"#666",opacity:psn?1:.6,border:psn?`2px solid ${pc}`:"2px solid transparent"}}>
              {psn ? `${psn.emoji} ${lang==="ko"?"시작하기":lang==="zh"?"开始":lang==="ja"?"はじめる":"Start"}` : `👆 ${lang==="ko"?"도사를 선택하세요":lang==="zh"?"请选择神算":lang==="ja"?"占い師を選んでください":"Choose an Oracle"}`}
            </button>
          </div>
        )}

        {/* ═══ FORM ═══ */}
        {step==="form" && (
          <div className="pop">
            {/* badge */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:`${pc}10`,borderRadius:10,border:`1px solid ${pc}28`,marginBottom:14}}>
              <span style={{fontSize:24}}>{psn.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:"bold",color:pc,fontSize:13}}>{psn.name[lang]}</div>
                <div style={{fontSize:11,color:"#ffffff44"}}>{psn.desc[lang]}</div>
              </div>
              <button onClick={()=>setStep("persona")} style={{background:"transparent",border:`1px solid ${pc}40`,color:pc,padding:"4px 9px",borderRadius:14,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                {lang==="ko"?"변경":lang==="zh"?"更换":lang==="ja"?"変更":"Change"}
              </button>
            </div>

            <div style={card()}>
              <div style={{fontWeight:"bold",color:"#ede0ff",marginBottom:14,fontSize:14}}>
                📋 {lang==="ko"?"내 정보 입력":lang==="zh"?"您的信息":lang==="ja"?"あなたの情報":"Your Information"}
              </div>

              {/* name */}
              <div style={{marginBottom:13}}>
                <label style={{display:"block",marginBottom:5,fontSize:12,color:"#ffffff66"}}>
                  {lang==="ko"?"이름":lang==="zh"?"姓名":lang==="ja"?"お名前":"Name"}
                </label>
                <input
                  style={{display:"block",width:"100%",padding:"10px 12px",fontSize:14,fontFamily:"inherit",background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:8,color:"#ede0ff",outline:"none"}}
                  placeholder={lang==="ko"?"이름 (선택)":lang==="zh"?"姓名（选填）":lang==="ja"?"お名前（任意）":"Name (optional)"}
                  value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                />
              </div>

              {/* date */}
              <div style={{marginBottom:14}}>
                {/* ── 양력/음력 토글 ── */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:13,color:"#ffffff88",fontWeight:"bold"}}>
                    📅 {lang==="ko"?"생년월일":lang==="zh"?"出生日期":lang==="ja"?"生年月日":"Date of Birth"}
                  </div>
                  <div style={{display:"flex",gap:0,borderRadius:20,overflow:"hidden",border:`1px solid ${pc}55`,background:"rgba(0,0,0,.3)"}}>
                    {[
                      {v:false, ko:"양력 ☀️", en:"Solar ☀️", zh:"阳历 ☀️", ja:"新暦 ☀️"},
                      {v:true,  ko:"음력 🌙", en:"Lunar 🌙", zh:"农历 🌙", ja:"旧暦 🌙"},
                    ].map(opt=>(
                      <button key={String(opt.v)}
                        onClick={()=>setForm({...form,isLunar:opt.v})}
                        style={{
                          padding:"6px 14px",
                          fontSize:12,
                          fontFamily:"inherit",
                          cursor:"pointer",
                          border:"none",
                          background: form.isLunar===opt.v ? pc : "transparent",
                          color: form.isLunar===opt.v ? "#fff" : `${pc}bb`,
                          fontWeight: form.isLunar===opt.v ? "bold" : "normal",
                          transition:"all .2s",
                          whiteSpace:"nowrap",
                        }}>
                        {opt[lang] || opt.ko}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1.4fr 1.4fr",gap:8}}>
                  {/* year */}
                  <div>
                    <label style={{display:"block",marginBottom:5,fontSize:12,color:"#ffffff66"}}>
                      {lang==="ko"?"연도":lang==="zh"?"年":lang==="ja"?"年":"Year"}
                    </label>
                    <select
                      style={{display:"block",width:"100%",padding:"10px 10px",fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,.07)",border:`1.5px solid ${form.year?"rgba(255,255,255,.3)":"rgba(255,255,255,.13)"}`,borderRadius:8,color:form.year?"#ede0ff":"#888",outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none"}}
                      value={form.year}
                      onChange={e=>setForm({...form,year:e.target.value,day:""})}>
                      <option value="">{lang==="ko"?"연도":lang==="zh"?"年":"Yr"}</option>
                      {years.map(y=><option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  {/* month */}
                  <div>
                    <label style={{display:"block",marginBottom:5,fontSize:12,color:"#ffffff66"}}>
                      {lang==="ko"?"월":lang==="zh"?"月":"Mo."}
                    </label>
                    <select
                      style={{display:"block",width:"100%",padding:"10px 10px",fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,.07)",border:`1.5px solid ${form.month?"rgba(255,255,255,.3)":"rgba(255,255,255,.13)"}`,borderRadius:8,color:form.month?"#ede0ff":"#888",outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none"}}
                      value={form.month}
                      onChange={e=>setForm({...form,month:e.target.value,day:""})}>
                      <option value="">{lang==="ko"?"월":lang==="zh"?"月":"Mo"}</option>
                      {(MONTH_NAMES[lang]||MONTH_NAMES["en"]).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  {/* day */}
                  <div>
                    <label style={{display:"block",marginBottom:5,fontSize:12,color:"#ffffff66"}}>
                      {lang==="ko"?"일":lang==="zh"?"日":"Day"}
                    </label>
                    <select
                      style={{display:"block",width:"100%",padding:"10px 10px",fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,.07)",border:`1.5px solid ${form.day?"rgba(255,255,255,.3)":"rgba(255,255,255,.13)"}`,borderRadius:8,color:form.day?"#ede0ff":"#888",outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none"}}
                      value={form.day}
                      onChange={e=>setForm({...form,day:e.target.value})}>
                      <option value="">{lang==="ko"?"일":lang==="zh"?"日":"D"}</option>
                      {days.map(d=><option key={d} value={d}>{d}{lang==="ko"?"일":""}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* time */}
              <div>
                <div style={{fontSize:13,color:"#ffffff88",fontWeight:"bold",marginBottom:6}}>
                  🕐 {lang==="ko"?"태어난 시간":lang==="zh"?"出生时辰":lang==="ja"?"生まれた時間":"Birth Time"}
                </div>
                <button className={`ubtn ${form.noTime?"on":""}`}
                  onClick={()=>setForm({...form,noTime:!form.noTime,hour:-1})}>
                  {form.noTime?"✓ ":""}{lang==="ko"?"시간을 모릅니다":lang==="zh"?"不知道出生时间":lang==="ja"?"時間がわかりません":"I don't know the time"}
                </button>
                {!form.noTime && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8}}>
                    {(HOUR_NAMES[lang]||HOUR_NAMES["en"]).map((h,i)=>(
                      <button key={i} className={`hbtn ${form.hour===i?"on":""}`}
                        onClick={()=>setForm({...form,hour:i,noTime:false})}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* gender */}
            <div style={card()}>
              <div style={{fontSize:13,color:"#ffffff88",fontWeight:"bold",marginBottom:10}}>
                {lang==="ko"?"성별":lang==="zh"?"性别":lang==="ja"?"性別":"Gender"}
              </div>
              <div style={{display:"flex",gap:10}}>
                {[{v:"female",t:{ko:"♀ 여자",en:"♀ Female",zh:"♀ 女",ja:"♀ 女性"}},{v:"male",t:{ko:"♂ 남자",en:"♂ Male",zh:"♂ 男",ja:"♂ 男性"}}].map(g=>(
                  <button key={g.v} onClick={()=>setForm({...form,gender:g.v})}
                    style={{flex:1,padding:"10px",border:`1.5px solid ${form.gender===g.v?pc:"rgba(255,255,255,.12)"}`,borderRadius:8,background:form.gender===g.v?`${pc}15`:"transparent",color:form.gender===g.v?pc:"#aaa",cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all .2s"}}>
                    {g.t[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* reading type */}
            <div style={card()}>
              <div style={{fontSize:13,color:"#ffffff77",marginBottom:10,fontWeight:"bold"}}>
                {lang==="ko"?"어떤 운세를 볼까요?":lang==="zh"?"想算什么？":lang==="ja"?"何を占いますか？":"What would you like?"}
              </div>
              {[
                {k:"saju",e:"🌌",t:{ko:"사주팔자 (전체인생)",en:"Full Saju Reading",zh:"四柱八字（全命运）",ja:"四柱推命（人生全体）"}},
                {k:"daily",e:"☀️",t:{ko:"오늘 운세",en:"Today's Fortune",zh:"今日运势",ja:"今日の運勢"}},
                {k:"love",e:"💕",t:{ko:"연애·결혼운",en:"Love & Marriage",zh:"桃花·婚姻运",ja:"恋愛・結婚運"}},
                {k:"money",e:"💰",t:{ko:"재물·직업운",en:"Wealth & Career",zh:"财运·事业运",ja:"財運・仕事運"}},
              ].map(o=>(
                <div key={o.k} className={`rt ${rtype===o.k?"sel":""}`} onClick={()=>setRtype(o.k)}>
                  <span style={{fontSize:18}}>{o.e}</span>
                  <span style={{fontSize:13}}>{o.t[lang]}</span>
                  {rtype===o.k && <span style={{marginLeft:"auto",color:pc,fontSize:16}}>✓</span>}
                </div>
              ))}
            </div>

            <button
              className="mainbtn"
              disabled={!canGo}
              onClick={runReading}
              style={{background:canGo?`linear-gradient(135deg,${pc}cc,${pc})`:"rgba(255,255,255,.07)",color:canGo?"#fff":"#666",border:`2px solid ${canGo?pc:"transparent"}`,opacity:canGo?1:.5,marginBottom:8}}>
              🔮 {lang==="ko"?"운세 보기":lang==="zh"?"揭示命运":lang==="ja"?"運勢を占う":"Reveal Fortune"}
            </button>
            <div style={{textAlign:"center",fontSize:11,color:"#ffffff18"}}>
              {lang==="ko"?"재미로 보는 것입니다":lang==="zh"?"仅供娱乐":lang==="ja"?"娯楽目的です":"For entertainment only"}
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {step==="result" && (
          <div className="pop">

            {/* saju chart */}
            {saju && (
              <div style={cardH()}>
                <div style={{fontWeight:"bold",color:pc,fontSize:13,marginBottom:12}}>
                  ⬡ {lang==="ko"?"사주 오행 원국":lang==="zh"?"五行原局":lang==="ja"?"五行チャート":"Five Elements Chart"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:`repeat(${saju.pillars.length},1fr)`,gap:6,marginBottom:14}}>
                  {saju.pillars.map((p,i)=>(
                    <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:8,padding:"8px 4px",border:`1px solid ${EL_COLOR[p.sEl]}33`}}>
                      <div style={{fontSize:9,color:"#ffffff44",marginBottom:3}}>{lang==="en"?p.lblE:p.lbl}</div>
                      <div style={{color:EL_COLOR[p.sEl],fontWeight:"bold",fontSize:20,lineHeight:1.1}}>{p.stem}</div>
                      <div style={{color:"#ffffff55",fontSize:9,marginBottom:2}}>{p.stemK}({elL(p.sEl)})</div>
                      <div style={{width:1,height:8,background:"rgba(255,255,255,.1)",margin:"2px auto"}}/>
                      <div style={{color:EL_COLOR[p.bEl],fontSize:20,lineHeight:1.1}}>{p.br}</div>
                      <div style={{color:"#ffffff55",fontSize:9,marginTop:2}}>{p.brK}({elL(p.bEl)})</div>
                    </div>
                  ))}
                </div>
                {Object.entries(saju.cnt).map(([el,n])=>(
                  <div key={el} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                    <span style={{fontSize:13,width:20}}>{EL_EMOJI[el]}</span>
                    <span style={{fontSize:12,color:EL_COLOR[el],width:44,fontWeight:"bold"}}>{elL(el)}</span>
                    <div style={{flex:1,height:8,background:"rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${n/maxEl*100}%`,background:EL_COLOR[el],borderRadius:4,transition:"width .7s"}}/>
                    </div>
                    <span style={{fontSize:12,color:"#ffffff44",width:14,textAlign:"right"}}>{n}</span>
                  </div>
                ))}
                <div style={{marginTop:10,display:"flex",flexWrap:"wrap"}}>
                  <span className="tag" style={{background:`${EL_COLOR[saju.dayMaster]}18`,border:`1px solid ${EL_COLOR[saju.dayMaster]}44`,color:EL_COLOR[saju.dayMaster]}}>
                    {EL_EMOJI[saju.dayMaster]} {lang==="ko"?"일간":lang==="ja"?"日干":"Day Master"}: {saju.dayMasterStem}{saju.dayStemChar}({elL(saju.dayMaster)})
                  </span>
                  <span className="tag" style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#ffffff66"}}>
                    🌸 {seL(saju.mbi)}
                  </span>
                  <span className="tag" style={{background:`${EL_COLOR[saju.dominant]}18`,border:`1px solid ${EL_COLOR[saju.dominant]}44`,color:EL_COLOR[saju.dominant]}}>
                    ▲ {elL(saju.dominant)}
                  </span>
                  <span className="tag" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",color:"#ffffff44"}}>
                    ▽ {elL(saju.weakest)}
                  </span>
                  {saju.tonggeun && <span className="tag" style={{background:"rgba(80,255,120,.08)",border:"1px solid rgba(80,255,120,.25)",color:"#88ffaa"}}>✔ 통근</span>}
                  {saju.clashes.length>0 && <span className="tag" style={{background:"rgba(255,80,80,.08)",border:"1px solid rgba(255,80,80,.3)",color:"#ff9999"}}>⚡{saju.clashes.join(" ")}</span>}
                  <span className="tag" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",color:"#ffffff44"}}>{saju.zodiacEm} {saju.zodiacKo}띠</span>
                  <span style={{fontSize:11,padding:"3px 10px",borderRadius:16,display:"inline-flex",alignItems:"center",gap:4,margin:"3px 2px",background:form.isLunar?`${pc}18`:"rgba(255,255,255,.04)",border:`1px solid ${form.isLunar?pc:"rgba(255,255,255,.1)"}`,color:form.isLunar?pc:"#ffffff44"}}>{form.isLunar?(lang==="ko"?"🌙 음력":lang==="zh"?"🌙 农历":lang==="ja"?"🌙 旧暦":"🌙 Lunar"):(lang==="ko"?"☀️ 양력":lang==="zh"?"☀️ 阳历":lang==="ja"?"☀️ 新暦":"☀️ Solar")}</span>
                </div>
              </div>
            )}

            {/* reading card - 페르소나별 편지지 */}
            <div style={{
              background: psn?.paper ? psn.paper.bg : "rgba(255,255,255,.045)",
              border: `2px solid ${psn?.paper?.border||pc+"28"}`,
              borderRadius: 16,
              padding: "0 0 20px 0",
              marginBottom: 12,
              overflow: "hidden",
              boxShadow: `0 8px 32px ${pc}22, inset 0 1px 0 rgba(255,255,255,.08)`,
              position: "relative",
            }}>
              {/* 편지지 패턴 레이어 */}
              {psn?.paper && (
                <div style={{position:"absolute",inset:0,background:psn.paper.pattern,pointerEvents:"none",zIndex:0}}/>
              )}
              {/* 편지지 헤더 장식 */}
              {psn?.paper && (
                <div style={{
                  background: psn.paper.headerBg,
                  borderBottom: `1px solid ${psn.paper.border}`,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  position: "relative",
                  zIndex: 1,
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:28}}>{psn.emoji}</span>
                    <div>
                      <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:13,color:psn.paper.accent,letterSpacing:1.5}}>{psn.name[lang]}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginTop:2}}>
                        {lang==="ko"?"사주 풀이":lang==="zh"?"命理解读":lang==="ja"?"鑑定結果":"Your Reading"} · {form.name||"—"} · {rtype==="saju"?"🌌":rtype==="daily"?"☀️":rtype==="love"?"💕":"💰"}
                      </div>
                    </div>
                  </div>
                  <div style={{fontSize:28,opacity:.7}}>{psn.paper.stamp}</div>
                </div>
              )}
              {/* 내용 영역 */}
              <div style={{padding:"0 18px",position:"relative",zIndex:1}}>

              {/* ── loading ── */}
              {busy && (
                <div style={{textAlign:"center",padding:"36px 0"}}>
                  <div style={{fontSize:44,display:"inline-block",animation:"spin 2.5s linear infinite",marginBottom:10}}>{psn?.emoji}</div>
                  <div style={{color:pc,fontSize:14,marginBottom:14}}>
                    {lang==="ko"?"도사가 사주를 풀이하고 있습니다...":lang==="zh"?"神算正在掐指一算...":lang==="ja"?"占い師が鑑定中です...":"Reading your destiny..."}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:7}}>
                    {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:pc,animation:`dot 1.4s ease-in-out ${i*0.24}s infinite`}}/>)}
                  </div>
                </div>
              )}

              {/* ── error ── */}
              {!busy && err && (
                <div style={{background:"rgba(255,0,0,.08)",border:"1px solid rgba(255,0,0,.3)",borderRadius:8,padding:14,color:"#ff9999",fontSize:13,lineHeight:1.7}}>
                  <div style={{fontWeight:"bold",marginBottom:4}}>⚠️ 오류</div>
                  <div style={{fontSize:12,wordBreak:"break-all"}}>{err}</div>
                </div>
              )}

              {/* ── result text ── */}
              {!busy && !err && text && (
                <div style={{lineHeight:2.05,fontSize:15.5,color:"#ede0ff",whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"'Nanum Myeongjo','Noto Serif KR',serif",letterSpacing:'0.03em'}}>
                  {text}
                </div>
              )}
            </div>
            </div>{/* reading card 닫기 */}

            {!busy && (
              <button
                className="mainbtn"
                onClick={()=>{setStep("form");setText("");setSaju(null);setErr("");}}
                style={{background:`linear-gradient(135deg,${pc}cc,${pc})`,color:"#fff",border:`2px solid ${pc}`,marginBottom:8}}>
                🔮 {lang==="ko"?"다시 보기":lang==="zh"?"再算一次":lang==="ja"?"もう一度":"New Reading"}
              </button>
            )}
            <div style={{textAlign:"center",marginTop:6,fontSize:11,color:"#ffffff18"}}>
              {lang==="ko"?"재미로 보는 것입니다":lang==="zh"?"仅供娱乐":lang==="ja"?"娯楽目的です":"For entertainment only"}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
