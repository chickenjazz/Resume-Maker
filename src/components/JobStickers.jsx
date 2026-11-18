import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './JobStickers.css';

gsap.registerPlugin(ScrollTrigger);

const stickers = [
  { name: 'stethoscope', cell: '0% 0%', angle: -14, depth: 0.65 },
  { name: 'wrench', cell: '50% 0%', angle: 17, depth: 1 },
  { name: 'chef', cell: '100% 0%', angle: -10, depth: 0.4 },
  { name: 'laptop', cell: '0% 100%', angle: 12, depth: 0.75 },
  { name: 'hardhat', cell: '50% 100%', angle: -16, depth: 1.15 },
  { name: 'paintbrush', cell: '100% 100%', angle: 15, depth: 0.5 },
];

export default function JobStickers({ scrollerRef }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller) return undefined;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          scroller,
          start: 0,
          end: () => Math.max(1, scroller.scrollHeight - scroller.clientHeight),
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      root.querySelectorAll('.job-sticker').forEach((element, index) => {
        const { depth } = stickers[index];
        timeline.fromTo(element, { x: 0, y: 0, rotation: 0 }, {
          x: () => (index % 2 ? -1 : 1) * (root.clientWidth <= 1000 ? 5 : 16) * depth,
          y: () => -(root.clientWidth <= 1000 ? 24 : 155) * depth,
          rotation: () => (index % 2 ? -1 : 1) * (root.clientWidth <= 1000 ? 4 : 12) * depth,
        }, 0);
      });

      let refreshFrame;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => timeline.scrollTrigger?.refresh());
      });
      observer.observe(scroller);
      if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(refreshFrame);
      };
    }, root);

    return () => media.revert();
  }, [scrollerRef]);

  return (
    <div className="job-stickers" ref={rootRef} aria-hidden="true">
      {stickers.map(({ name, cell, angle, depth }) => (
        <div
          key={name}
          className={`job-sticker job-sticker--${name}`}
          style={{ '--sticker-cell': cell, '--sticker-angle': `${angle}deg`, zIndex: Math.round(depth * 10) }}
        >
          <span className="job-sticker__art" />
        </div>
      ))}
    </div>
  );
}
