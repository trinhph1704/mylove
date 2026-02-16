import { useRef, useEffect, useState, useCallback } from 'react';
import { Prize, WHEEL_COLORS } from '../data';

interface Props {
  prizes: Prize[];
  playerName: string;
  onWin: (prize: Prize) => void;
  onBack: () => void;
}

export default function SpinWheel({ prizes, playerName, onWin, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>(0);
  const sizeRef = useRef(300);

  const numPrizes = prizes.length;
  const segmentAngle = (2 * Math.PI) / numPrizes;

  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D, currentRotation: number) => {
      const size = sizeRef.current;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 20;

      ctx.clearRect(0, 0, size, size);

      // Outer glow ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy + 2, radius + 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fill();
      ctx.restore();

      // Gold outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 4, 0, 2 * Math.PI);
      const ringGrad = ctx.createLinearGradient(0, 0, size, size);
      ringGrad.addColorStop(0, '#FFD700');
      ringGrad.addColorStop(0.5, '#FFA500');
      ringGrad.addColorStop(1, '#FFD700');
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw decorative dots on outer ring
      for (let i = 0; i < numPrizes; i++) {
        const angle = i * segmentAngle + currentRotation;
        const dotX = cx + Math.cos(angle) * (radius + 4);
        const dotY = cy + Math.sin(angle) * (radius + 4);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      // Draw segments
      prizes.forEach((prize, i) => {
        const startAngle = i * segmentAngle + currentRotation;
        const endAngle = startAngle + segmentAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        const segGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
        const baseColor = WHEEL_COLORS[i % WHEEL_COLORS.length];
        segGrad.addColorStop(0, lightenColor(baseColor, 20));
        segGrad.addColorStop(1, baseColor);
        ctx.fillStyle = segGrad;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text content
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);

        // Emoji
        const emojiSize = Math.max(18, radius / 7);
        ctx.font = `${emojiSize}px "Segoe UI Emoji", "Apple Color Emoji", Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 2;
        ctx.fillText(prize.emoji, radius * 0.68, -3);

        // Short name
        const textSize = Math.max(9, radius / 14);
        ctx.font = `bold ${textSize}px -apple-system, "Segoe UI", Arial, sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 3;
        let text = prize.name;
        if (text.length > 10) text = text.substring(0, 9) + '..';
        ctx.fillText(text, radius * 0.68, emojiSize * 0.65);

        ctx.restore();
      });

      // Inner circle shadow
      ctx.beginPath();
      ctx.arc(cx, cy + 1, radius * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();

      // Inner circle (center hub)
      const hubGrad = ctx.createRadialGradient(
        cx - 2, cy - 2, 0,
        cx, cy, radius * 0.15
      );
      hubGrad.addColorStop(0, '#fff');
      hubGrad.addColorStop(0.4, '#FFD700');
      hubGrad.addColorStop(1, '#FF6B6B');
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.14, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Heart in center
      ctx.font = `${radius * 0.12}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'transparent';
      ctx.fillText('❤️', cx, cy);
    },
    [prizes, numPrizes, segmentAngle]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const maxSize = Math.min(window.innerWidth - 24, 420);
    sizeRef.current = maxSize;

    canvas.width = maxSize * dpr;
    canvas.height = maxSize * dpr;
    canvas.style.width = `${maxSize}px`;
    canvas.style.height = `${maxSize}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    drawWheel(ctx, rotationRef.current);
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 7-10 full rotations + random offset for dramatic spin
    const extraRotations = (7 + Math.random() * 3) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalSpin = extraRotations + randomOffset;
    const duration = 7000;
    const startTime = performance.now();
    const startRotation = rotationRef.current;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      const currentRotation = startRotation + totalSpin * eased;
      rotationRef.current = currentRotation;

      drawWheel(ctx, currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Pointer is at top (3*PI/2 = 270deg in canvas coords)
        const pointerAngle = (3 * Math.PI) / 2;
        const normalizedAngle =
          ((pointerAngle - currentRotation) % (2 * Math.PI) + 2 * Math.PI) %
          (2 * Math.PI);
        const winnerIndex =
          Math.floor(normalizedAngle / segmentAngle) % numPrizes;

        setTimeout(() => {
          onWin(prizes[winnerIndex]);
        }, 600);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="step fade-in spin-step">
      <div className="spin-header">
        {!isSpinning && (
          <button className="btn-back" onClick={onBack} aria-label="Quay lại">
            ←
          </button>
        )}
        <h1 className="step-title spin-title">Vòng Quay May Mắn</h1>
      </div>
      <p className="step-desc">
        {playerName} ơi, hãy bấm nút để quay nhận quà tình yêu!
      </p>

      <div className="wheel-wrapper">
        <div className="wheel-container">
          <div className="wheel-pointer" />
          <canvas ref={canvasRef} className="wheel-canvas" />
        </div>
      </div>

      <button
        className={`btn btn-spin ${isSpinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={isSpinning}
      >
        {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
      </button>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r},${g},${b})`;
}
