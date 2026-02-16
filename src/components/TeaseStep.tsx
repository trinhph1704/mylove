interface Props {
  playerName: string;
  onContinue: () => void;
}

export default function TeaseStep({ playerName, onContinue }: Props) {
  return (
    <div className="step fade-in">
      <div className="tease-emoji">😜</div>
      <div className="tease-card">
        <p className="tease-title">TRÊU EM ĐẤY</p>
        <div className="tease-divider" />
        <p className="tease-text">
          Web này là dành riêng cho
        </p>
        <p className="tease-highlight">
          CỤC DÀNG CỦA ANH
        </p>
        <p className="tease-text">mà {playerName} ơi~</p>
      </div>
      <button className="btn btn-primary" onClick={onContinue}>
        Hehe, tiếp tục nào~
      </button>
    </div>
  );
}
