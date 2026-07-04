import { useRef, useEffect, useCallback } from 'react';

const LENS_SIZE = 200;

export default function FluidGlass() {
  const lensRef = useRef(null);
  const pos = useRef({ x: -300, y: -300 });
  const target = useRef({ x: -300, y: -300 });
  const raf = useRef(null);
  const visible = useRef(false);

  const animate = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * 0.12;
    pos.current.y += (target.current.y - pos.current.y) * 0.12;

    if (lensRef.current) {
      lensRef.current.style.transform =
        `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    }
    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const el = lensRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    let hideTimer = null;

    const show = () => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (!visible.current) {
        visible.current = true;
        if (el) el.style.opacity = '1';
      }
    };

    const hide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        visible.current = false;
        if (el) el.style.opacity = '0';
      }, 120);
    };

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        target.current = {
          x: e.clientX - rect.left - LENS_SIZE / 2,
          y: e.clientY - rect.top - LENS_SIZE / 2,
        };
        show();
      } else {
        hide();
      }
    };

    document.addEventListener('pointermove', onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [animate]);

  return (
    <>
      {/*
        SVG filter — replicates MeshTransmissionMaterial effects:
        • feDisplacementMap  → IOR / refraction distortion
        • feOffset + feColorMatrix → chromaticAberration
        • feGaussianBlur at end → thickness (frosted glass depth)
      */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="chromatic-lens" x="-5%" y="-5%" width="110%" height="110%">
            {/* IOR — refraction distortion */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />

            {/* Chromatic aberration — strong RGB split */}
            <feOffset in="distorted" dx="8" dy="3" result="shift-r" />
            <feOffset in="distorted" dx="-8" dy="-3" result="shift-b" />

            {/* Isolate R channel */}
            <feColorMatrix
              in="shift-r"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="r"
            />
            {/* Isolate G channel */}
            <feColorMatrix
              in="distorted"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="g"
            />
            {/* Isolate B channel */}
            <feColorMatrix
              in="shift-b"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="b"
            />

            {/* Recombine with screen blend */}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Outer ring — clean circle, NOT affected by SVG filter */}
      <div
        ref={lensRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: LENS_SIZE,
          height: LENS_SIZE,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          overflow: 'hidden',

          /* Glowing rim — matches ReactBits lens edge */
          border: '2px solid rgba(180, 200, 230, 0.45)',
          boxShadow: `
            0 0 25px rgba(100, 140, 255, 0.15),
            0 0 60px rgba(80, 100, 200, 0.08),
            0 8px 32px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08)
          `,
        }}
      >
        {/* Inner glass — chromatic aberration + refraction + dark glass */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',

            /* Thick dark glass — matches ReactBits transmission material */
            backdropFilter:
              'blur(3px) brightness(0.6) saturate(2.2) contrast(1.2)',
            WebkitBackdropFilter:
              'blur(3px) brightness(0.6) saturate(2.2) contrast(1.2)',

            /* Chromatic aberration + IOR distortion */
            filter: 'url(#chromatic-lens)',

            /* Glass specular highlight — top-left light reflection */
            background: `
              radial-gradient(
                circle at 30% 25%,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.03) 30%,
                transparent 60%
              ),
              radial-gradient(
                circle at 70% 80%,
                rgba(120, 100, 255, 0.06) 0%,
                transparent 50%
              )
            `,
          }}
        />
      </div>
    </>
  );
}
