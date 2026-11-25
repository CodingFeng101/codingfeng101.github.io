import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, EnvelopeSimple, GithubLogo, MapPin, Phone, WechatLogo, X } from "@phosphor-icons/react";
import { gsap, useMotion, EASE, playWhileVisible, animatePlum, birdLoops, petalLoops, ambientLoops } from "../motion.js";
import { ganzhiYear, season, shichen, solarTerm } from "../almanac.js";
import { Birds, InkWash, Mountains, PageFrame, Petals, PlumBranch, Seal, toChineseNumeral } from "./Ornaments.jsx";

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // 落到下面的旧方法
    }
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("copy failed");
}

function WechatDialog({ src, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector("button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useMotion(ref, ({ motion }) => {
    if (!motion) return undefined;
    gsap.from(ref.current, { opacity: 0, duration: 0.3 });
    gsap.from(ref.current.querySelector(".wechat-dialog"), { y: 30, scale: 0.94, rotate: -2, opacity: 0, duration: 0.6, ease: EASE.expo });
    return undefined;
  });
  return (
    <div ref={ref} className="wechat-backdrop" role="presentation" onClick={onClose}>
      <div className="wechat-dialog" role="dialog" aria-modal="true" aria-labelledby="wechat-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="wechat-close" onClick={onClose} aria-label="关闭微信二维码"><X size={16} weight="bold" /></button>
        <img src={src} alt="微信好友二维码" />
        <p id="wechat-title">微信扫码，添加好友</p>
      </div>
    </div>
  );
}

// 来信：整段写成一封信。「见字如面」一笔一笔写出来，落款处盖章。
export function Letter({ profile, letter, chapter, folio, style }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState("");
  const [wechatOpen, setWechatOpen] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = (value, key) => async () => {
    try {
      await copyText(value);
      setCopied(key);
    } catch {
      setCopied(`${key}-error`);
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(""), 1800);
  };

  useMotion(ref, ({ motion }) => {
    if (!motion) return undefined;
    const q = gsap.utils.selector(ref.current);
    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: ref.current, start: "top 70%" } })
      .fromTo(q(".letter-wash"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" })
      .from(q(".letter-paper"), { y: 80, rotate: -1.5, opacity: 0, duration: 1.2, ease: EASE.expo }, 0)
      .from(q(".letter-index"), { opacity: 0, x: -12, duration: 0.6 }, "<0.3")
      .from(q(".letter-greeting i"), { opacity: 0, duration: 0.05, stagger: 0.14, ease: "none" }, "<0.2")
      .from(q(".letter-caret"), { opacity: 0, duration: 0.2 }, "<")
      .from(q(".letter-body p"), { opacity: 0, y: 14, duration: 0.8, stagger: 0.18 }, "+=0.1")
      .from(q(".contact-row"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.07 }, "-=0.4")
      .from(q(".letter-sign > *"), { opacity: 0, y: 10, duration: 0.6, stagger: 0.12 }, "-=0.3")
      .from(q(".letter-seal"), { scale: 2.6, rotate: -35, opacity: 0, duration: 0.5, ease: "back.out(2.6)" }, "-=0.2")
      .to(q(".letter-paper"), { x: 2, duration: 0.05, repeat: 3, yoyo: true }, "-=0.35");
    animatePlum(ref.current, ref.current);
    gsap.from(q(".mtn"), { yPercent: 50, opacity: 0, duration: 2, stagger: 0.2, ease: EASE.soft, scrollTrigger: { trigger: ref.current, start: "top 40%" } });
    playWhileVisible(ref.current, [
      gsap.to(q(".letter-caret"), { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" }),
      ...birdLoops(ref.current),
      ...ambientLoops(ref.current),
      ...petalLoops(ref.current),
    ]);
    return undefined;
  });

  const label = (key, idle, done) => (copied === key ? done : copied === `${key}-error` ? "复制失败" : idle);
  // 落款：干支纪年 + 节气 + 时辰，比如「丙午年冬 · 小雪 · 亥时」

  return (
    <section ref={ref} id="letter" className="letter page band band--oat" data-nav="letter" style={style}>
      <InkWash tone="clay" className="letter-wash" />
      <PageFrame />
      <Mountains className="letter-mountains" />
      <Birds count={4} className="letter-birds" />
      <Petals count={7} />
      <PlumBranch className="letter-plum" />
      <div className="letter-paper">
        <p className="letter-index"><span>{chapter.index}</span> {chapter.title} · {chapter.en}</p>
        <h2 className="letter-greeting">
          {[...letter.greeting].map((char, index) => <i key={index}>{char}</i>)}
          <span className="letter-caret" aria-hidden="true" />
        </h2>
        <div className="letter-body">{letter.body.map((line) => <p key={line}>{line}</p>)}</div>

        <ul className="contacts">
          <li className="contact-row">
            <span className="contact-key"><EnvelopeSimple size={17} />邮箱</span>
            <span className="contact-value">{profile.email}</span>
            <button type="button" className="btn btn--small" onClick={copy(profile.email, "email")}>
              {copied === "email" && <Check size={14} weight="bold" />}{label("email", "复制", "已复制")}
            </button>
          </li>
          <li className="contact-row">
            <span className="contact-key"><Phone size={17} />电话</span>
            <span className="contact-value">{profile.phone}</span>
            <button type="button" className="btn btn--small" onClick={copy(profile.phone, "phone")}>
              {copied === "phone" && <Check size={14} weight="bold" />}{label("phone", "复制", "已复制")}
            </button>
          </li>
          <li className="contact-row">
            <span className="contact-key"><WechatLogo size={17} />微信</span>
            <span className="contact-value">扫码添加</span>
            <button type="button" className="btn btn--small" onClick={() => setWechatOpen(true)} aria-haspopup="dialog">二维码</button>
          </li>
          <li className="contact-row">
            <span className="contact-key"><GithubLogo size={17} />GitHub</span>
            <span className="contact-value">{profile.github.replace("https://", "")}</span>
            <a className="btn btn--small" href={profile.github} target="_blank" rel="noreferrer">前往 <ArrowUpRight size={13} /></a>
          </li>
        </ul>

        <div className="letter-sign">
          <span className="letter-sign-name">{profile.name}</span>
          <span className="letter-sign-meta"><MapPin size={14} />{ganzhiYear()}年{season()} · {solarTerm()} · {shichen()} · 书于{profile.location}</span>
        </div>
        <Seal text={profile.seal} size="lg" className="letter-seal" />
      </div>
      <p className="colophon">纸短情长，不尽欲言。</p>
      {folio && <span className="folio" aria-hidden="true">— {toChineseNumeral(folio)} · 终 —</span>}
      {wechatOpen && <WechatDialog src={profile.wechatQr} onClose={() => setWechatOpen(false)} />}
    </section>
  );
}
