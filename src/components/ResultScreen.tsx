import { useState, useRef, useCallback } from 'react';
import { Prize } from '../data';
import { sendHeartUpdate } from '../utils/sheets';
import Confetti from './Confetti';

interface Props {
  prize: Prize;
  playerName: string;
  loverName: string;
  onSpinAgain: () => void;
}

const BONUS_PASSWORD = '100226';

interface FloatingHeart {
  id: number;
  x: number;
  emoji: string;
}

export default function ResultScreen({
  prize,
  playerName,
  loverName,
  onSpinAgain,
}: Props) {
  const [bonusState, setBonusState] = useState<'idle' | 'password' | 'letter'>('idle');
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Heart reaction state
  const [heartCount, setHeartCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const heartIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const HEART_EMOJIS = ['❤️', '💖', '💗', '💕', '💝', '🥰', '😘', '💓'];

  const handleHeartTap = useCallback(() => {
    const newCount = heartCount + 1;
    setHeartCount(newCount);

    // Spawn floating heart
    const id = ++heartIdRef.current;
    const heart: FloatingHeart = {
      id,
      x: 30 + Math.random() * 40,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    };
    setFloatingHearts((prev) => [...prev, heart]);

    // Remove after animation
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1500);

    // Debounced send to Google Sheets
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      sendHeartUpdate(playerName, newCount);
    }, 2000);
  }, [heartCount, playerName]);

  const handleBonusClick = () => {
    setBonusState('password');
    setPinDigits(['', '', '', '', '', '']);
    setErrorMsg('');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...pinDigits];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setPinDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      if (pasted.length === 6) checkPassword(newDigits);
      return;
    }

    newDigits[index] = value;
    setPinDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5) checkPassword(newDigits);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkPassword = (digits: string[]) => {
    const code = digits.join('');
    if (code === BONUS_PASSWORD) {
      setErrorMsg('');
      setBonusState('letter');
    } else {
      setErrorMsg('Sai mật khẩu, thử lại nhé!');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPinDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 600);
    }
  };

  const handleCloseBonus = () => {
    setBonusState('idle');
    setPinDigits(['', '', '', '', '', '']);
    setErrorMsg('');
  };

  // ==================== LOVE LETTER ====================
  if (bonusState === 'letter') {
    return (
      <div className="letter-screen fade-in">
        <Confetti />

        <div className="letter-header">
          <button className="btn-back" onClick={handleCloseBonus} aria-label="Quay lại">
            ←
          </button>
          <div className="letter-header-icon">💌</div>
          <div style={{ width: 38 }} />
        </div>

        <div className="letter-scroll">
          <div className="letter-paper">
            <div className="letter-ribbon" />
            <div className="letter-deco-tl">❦</div>
            <div className="letter-deco-br">❦</div>

            <p className="letter-greeting">Em yêu à,</p>

            <div className="letter-body">
              <p>
                Một tháng bên nhau có thể chưa đủ dài để anh hiểu hết mọi điều
                về em, nhưng đủ để anh biết rằng em là người anh muốn cùng bước
                tiếp những chặng đường phía trước. Anh thấy được sức mạnh trong
                em — một cô gái vừa học giỏi vừa biết tự lập, vừa kiên cường
                vừa dịu dàng. Và anh cũng cảm nhận được những vết thương mà quá
                khứ đã để lại trong tim em.
              </p>
              <p>
                Anh không thể xóa đi những gì đã qua, cũng không thể hứa rằng
                tương lai sẽ không còn chông gai. Nhưng anh muốn em biết rằng từ
                giờ, em không phải một mình nữa. Anh ở đây, không phải để thay
                thế ai, mà để cùng em vượt qua — vượt qua những nỗi đau còn
                vương vấn, vượt qua những khó khăn của hiện tại, và cùng nhau
                đối mặt với bất cứ điều gì phía trước.
              </p>
              <p>
                Anh sẽ kiên nhẫn giúp em hàn gắn những vết thương, sẽ là bờ vai
                để em dựa vào mỗi khi mệt mỏi, và sẽ là ánh sáng nhỏ bé bên em
                trong những ngày tối tăm nhất. Bởi vì với anh, em xứng đáng được
                yêu thương đúng cách — một tình yêu chân thành, tôn trọng và
                cùng nhau lớn lên.
              </p>
              <p>
                Hãy để anh được ở bên em, bảo vệ em, đồng hành cùng em, người
                con gái mạnh mẽ và đáng yêu của đời anh.
              </p>
            </div>

            <div className="letter-closing">
              <p className="letter-love">Yêu em nhiều nhiềuuuu.</p>
              <p className="letter-sign">— Người đàn ông của em —</p>
            </div>

            <div className="letter-hearts-inline">
              {['❤️', '💕', '💖', '💗', '💝'].map((h, i) => (
                <span
                  key={i}
                  className="letter-heart"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Heart reaction section */}
          <div className="heart-reaction">
            <p className="heart-reaction-label">Thả tim cho lá thư này</p>
            <div className="heart-tap-area">
              {/* Floating hearts */}
              {floatingHearts.map((h) => (
                <span
                  key={h.id}
                  className="heart-float"
                  style={{ left: `${h.x}%` }}
                >
                  {h.emoji}
                </span>
              ))}
              <button className="heart-btn" onClick={handleHeartTap}>
                <span className="heart-btn-emoji">❤️</span>
              </button>
            </div>
            <p className="heart-count">
              {heartCount > 0 && (
                <>
                  <span className="heart-count-number">{heartCount.toLocaleString()}</span>
                  <span className="heart-count-text">
                    {heartCount === 1 ? ' lượt yêu thích' : ' lượt yêu thích'}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PASSWORD ====================
  if (bonusState === 'password') {
    return (
      <div className="step fade-in result-step">
        <div className="bonus-modal">
          <button className="bonus-close" onClick={handleCloseBonus}>✕</button>
          <div className="bonus-icon">🔒</div>
          <h2 className="bonus-title">Phần quà Bonus</h2>
          <p className="bonus-desc">Nhập mật khẩu 6 số để mở quà đặc biệt</p>
          <div className={`pin-container ${shake ? 'pin-shake' : ''}`}>
            {pinDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={6}
                className={`pin-input ${digit ? 'pin-filled' : ''}`}
                value={digit}
                onChange={(e) => handlePinChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>
          {errorMsg && <p className="pin-error fade-in">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  // ==================== DEFAULT RESULT ====================
  return (
    <div className="step fade-in result-step">
      <Confetti />

      <div className="result-card">
        <div className="result-emoji">{prize.emoji}</div>
        <h1 className="result-title">Chúc mừng!</h1>
        <p className="result-name">{playerName}</p>
        <p className="result-prize-label">
          Phần quà dành cho bạn và "{loverName}" là:
        </p>
        <div className="result-prize">
          <span className="result-prize-text">
            {prize.emoji} {prize.name}
          </span>
        </div>
        <p className="result-message">
          Hãy cùng nhau thực hiện phần quà này nhé! Chúc hai bạn luôn hạnh phúc
          bên nhau~
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn btn-primary" onClick={onSpinAgain}>
          Quay lại lần nữa
        </button>
        <button className="btn btn-bonus" onClick={handleBonusClick}>
          🎁 Phần quà Bonus
        </button>
      </div>
    </div>
  );
}
