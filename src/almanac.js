// 小小的「黄历」：干支纪年、二十四节气、十二时辰。只用来做落款和题款，精确到大约一天就够了。
const STEMS = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";

// 每个节气在公历里大致的日子（各年相差不过一两天）
const TERMS = [
  [1, 5, "小寒"], [1, 20, "大寒"], [2, 4, "立春"], [2, 19, "雨水"], [3, 5, "惊蛰"], [3, 20, "春分"],
  [4, 4, "清明"], [4, 20, "谷雨"], [5, 5, "立夏"], [5, 21, "小满"], [6, 5, "芒种"], [6, 21, "夏至"],
  [7, 7, "小暑"], [7, 22, "大暑"], [8, 7, "立秋"], [8, 23, "处暑"], [9, 7, "白露"], [9, 23, "秋分"],
  [10, 8, "寒露"], [10, 23, "霜降"], [11, 7, "立冬"], [11, 22, "小雪"], [12, 7, "大雪"], [12, 21, "冬至"],
];

export function ganzhiYear(date = new Date()) {
  const n = date.getFullYear() - 4;
  return STEMS[((n % 10) + 10) % 10] + BRANCHES[((n % 12) + 12) % 12];
}

export function solarTerm(date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let current = TERMS[TERMS.length - 1][2]; // 一月初还在冬至里
  for (const [tm, td, name] of TERMS) {
    if (m > tm || (m === tm && d >= td)) current = name;
  }
  return current;
}

export function shichen(date = new Date()) {
  return BRANCHES[Math.floor((date.getHours() + 1) / 2) % 12] + "时";
}

export function season(date = new Date()) {
  return ["冬", "春", "春", "春", "夏", "夏", "夏", "秋", "秋", "秋", "冬", "冬"][date.getMonth()];
}
