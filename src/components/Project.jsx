import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GitFork, GithubLogo, Star } from "@phosphor-icons/react";
import { gsap, useMotion, EASE } from "../motion.js";
import { getGithubRepoStats, GITHUB_STATS_CACHE_TTL } from "../githubStats.js";
import { HandArrow, HandUnderline, Seal, toChineseNumeral } from "./Ornaments.jsx";

const BIG = "壹贰叁肆伍陆柒捌玖拾";

function useGithubStats(repoPath) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (!repoPath) return undefined;
    let active = true;
    const [owner, repo] = repoPath.split("/");
    const refresh = () => getGithubRepoStats(owner, repo).then((value) => active && setStats(value));
    refresh();
    const timer = window.setInterval(refresh, GITHUB_STATS_CACHE_TTL);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [repoPath]);
  return stats;
}

// 前后对比：拖动中线，左边是原始图片，右边是重建后的可编辑页面
function CompareSlider({ before, after }) {
  const ref = useRef(null);
  const pos = useRef({ value: 50 });
  const [value, setValue] = useState(50);

  const apply = (next) => {
    const clamped = Math.max(0, Math.min(100, next));
    pos.current.value = clamped;
    ref.current?.style.setProperty("--pos", `${clamped}%`);
    setValue(Math.round(clamped));
  };

  useMotion(ref, ({ motion }) => {
    if (!motion) {
      apply(50);
      return undefined;
    }
    apply(100);
    const tween = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%" } })
      .to(pos.current, { value: 12, duration: 1.4, ease: "power2.inOut", onUpdate: () => apply(pos.current.value) })
      .to(pos.current, { value: 55, duration: 1.1, ease: EASE.soft, onUpdate: () => apply(pos.current.value) });
    return () => tween.kill();
  });

  const fromPointer = (event) => {
    const rect = ref.current.getBoundingClientRect();
    apply(((event.clientX - rect.left) / rect.width) * 100);
  };

  return (
    <div
      ref={ref}
      className="compare"
      onPointerDown={(event) => {
        gsap.killTweensOf(pos.current);
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => event.buttons === 1 && fromPointer(event)}
    >
      <img className="compare-after" src={after} alt="重建后的可编辑 PPTX 页面，文本框处于选中状态" draggable="false" />
      <div className="compare-before"><img src={before} alt="原始的图片式 PPT 页面" draggable="false" /></div>
      <span className="compare-tag compare-tag--l">图片 PPT</span>
      <span className="compare-tag compare-tag--r">可编辑 PPTX</span>
      <div
        className="compare-handle"
        role="slider"
        tabIndex={0}
        aria-label="拖动对比原图与重建结果"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") apply(pos.current.value - 5);
          if (event.key === "ArrowRight") apply(pos.current.value + 5);
        }}
      >
        <i />
      </div>
    </div>
  );
}

export function Project({ project }) {
  const ref = useRef(null);
  const stats = useGithubStats(project.githubRepo);
  // 视频加载失败（比如还没上传）就退回截图
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = project.video && !videoFailed;
  const caption = showVideo ? project.caption : project.stillCaption || project.caption;

  useMotion(ref, ({ motion, desktop, fine }) => {
    if (!motion) return undefined;
    const section = ref.current;
    const q = gsap.utils.selector(section);
    const start = "top 72%";

    // —— 左侧文字 ——
    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: section, start } })
      .from(q(".pj-number i"), { yPercent: 100, duration: 0.9, stagger: 0.08, ease: EASE.expo })
      .from(q(".pj-title i"), { yPercent: 110, duration: 1, ease: EASE.expo }, "<0.1")
      .from(q(".pj-subtitle"), { opacity: 0, x: -14, duration: 0.7 }, "<0.25")
      .from(q(".pj-title-row .draw"), { drawSVG: "0%", duration: 0.9, ease: "power2.inOut" }, "<0.1")
      .from(q(".pj-meta > *"), { opacity: 0, y: 10, duration: 0.5, stagger: 0.06 }, "<0.2")
      .from(q(".pj-points li"), { opacity: 0, y: 16, duration: 0.6, stagger: 0.09 }, "<0.1")
      .from(q(".pj-points li b"), { scale: 0, duration: 0.5, stagger: 0.09, ease: "back.out(3)" }, "<")
      .from(q(".pj-tags span"), { opacity: 0, scale: 0.6, y: 8, duration: 0.45, stagger: 0.04, ease: "back.out(2)" }, "<0.3");

    // —— 右侧：色卡升起，纸张散开，截图从左到右揭开 ——
    const visual = q(".pj-visual")[0];
    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: visual, start: "top 78%" } })
      .from(q(".stack-card"), { clipPath: "inset(100% 0% 0% 0% round 24px)", duration: 1.1, ease: EASE.travel })
      .from(q(".sheet--back"), { rotate: 0, yPercent: 18, opacity: 0, duration: 1 }, "<0.35")
      .from(q(".sheet--mid"), { rotate: 0, yPercent: 18, opacity: 0, duration: 1 }, "<0.08")
      .from(q(".sheet--front"), { yPercent: 22, opacity: 0, duration: 1 }, "<0.08")
      .from(q(".shot-mask"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: EASE.travel }, "<0.2")
      .from(q(".shot-mask img, .shot-mask video"), { scale: 1.18, duration: 1.6 }, "<")
      .from(q(".hand-arrow .draw"), { drawSVG: "0%", duration: 0.7, stagger: 0.3, ease: "power2.inOut" }, "-=0.6")
      .from(q(".hand-note i"), { opacity: 0, y: 6, duration: 0.4, stagger: 0.035 }, "-=0.2")
      .from(q(".stack-caption"), { opacity: 0, y: 8, duration: 0.6 }, "<")
      .from(q(".pj-motto"), { scale: 2.6, rotate: 30, opacity: 0, duration: 0.5, ease: "back.out(2.6)" }, "-=0.3");

    // 背后的大写数字：淡淡一层，比内容滚得慢
    gsap.fromTo(q(".pj-water"), { yPercent: 18, opacity: 0 }, {
      yPercent: -18, opacity: 1, ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
    });

    // 视差：几层纸以不同速度移动
    if (desktop) {
      [[".sheet--back", 16], [".sheet--mid", 8], [".hand-note", -22], [".hand-arrow", -16]].forEach(([sel, dist]) => {
        gsap.fromTo(q(sel), { y: `+=${dist / 2}` }, {
          y: `-=${dist}`, ease: "none",
          scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
    }

    // 悬停时整叠纸轻轻倾斜
    let removeTilt = () => {};
    const tilt = q(".stack-tilt")[0];
    if (fine && tilt) {
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (event) => {
        const rect = tilt.getBoundingClientRect();
        ry(((event.clientX - rect.left) / rect.width - 0.5) * 8);
        rx(((event.clientY - rect.top) / rect.height - 0.5) * -6);
      };
      const leave = () => { rx(0); ry(0); };
      tilt.addEventListener("pointermove", move);
      tilt.addEventListener("pointerleave", leave);
      removeTilt = () => {
        tilt.removeEventListener("pointermove", move);
        tilt.removeEventListener("pointerleave", leave);
      };
    }

    return () => removeTilt();
  });

  const titleRuleVariant = Number(project.number) - 1;

  return (
    <article ref={ref} className="project">
      <span className="pj-water" aria-hidden="true">{BIG[Number(project.number) - 1]}</span>
      <div className="pj-copy">
        <div className="pj-number" aria-hidden="true">
          {[..."其" + toChineseNumeral(Number(project.number))].map((d, i) => <span key={i}><i>{d}</i></span>)}
          <span className="pj-number-en"><i>{project.number}</i></span>
        </div>
        <div className="pj-title-row">
          <h3 className="pj-title"><span><i>{project.title}</i></span></h3>
          <p className="pj-subtitle">{project.subtitle}</p>
          <HandUnderline variant={titleRuleVariant} className="pj-underline" />
        </div>
        <div className="pj-meta">
          <time>{project.period}</time>
          <span className="chip">{project.role}</span>
          {stats && (
            <span className="pj-stats" aria-label={`${project.title} GitHub 统计`}>
              <span title={`Star ${stats.stars}`}><Star size={13} weight="fill" aria-hidden="true" />{stats.stars.toLocaleString("zh-CN")}</span>
              <span title={`Fork ${stats.forks}`}><GitFork size={13} weight="bold" aria-hidden="true" />{stats.forks.toLocaleString("zh-CN")}</span>
            </span>
          )}
          {project.links.map((link) => (
            <a
              className="text-link"
              href={link.href}
              key={link.label}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} ${link.label}链接`}
            >
              {link.kind === "source" ? <GithubLogo size={14} /> : <ArrowUpRight size={14} />}
              {link.label}
            </a>
          ))}
        </div>
        <ul className="pj-points">
          {project.copy.map((item) => <li key={item}><b aria-hidden="true" />{item}</li>)}
        </ul>
        <div className="pj-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
      </div>

      <div className="pj-visual">
        <div className="stack-tilt">
          <div className={`stack tone-${project.tone}`}>
            <span className="stack-card" aria-hidden="true" />
            <span className="sheet sheet--back" aria-hidden="true" />
            <span className="sheet sheet--mid" aria-hidden="true" />
            <figure className="sheet sheet--front">
              {showVideo ? (
                <div className="shot-mask">
                  <video
                    src={project.video}
                    poster={project.image || project.after}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={`${project.title} 演示视频`}
                    onError={() => setVideoFailed(true)}
                  />
                </div>
              ) : project.image ? (
                <div className="shot-mask"><img src={project.image} alt={project.imageAlt} /></div>
              ) : (
                <div className="shot-mask"><CompareSlider before={project.before} after={project.after} /></div>
              )}
            </figure>
            {project.motto && <Seal text={project.motto} size="sm" className="pj-motto" />}
            <HandArrow />
            <p className="hand-note">{[...project.note].map((char, index) => <i key={index}>{char}</i>)}</p>
          </div>
        </div>
        <p className="stack-caption">{caption}</p>
      </div>
    </article>
  );
}
