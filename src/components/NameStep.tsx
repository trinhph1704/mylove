import { useState } from 'react';

interface Props {
  onSubmit: (name: string) => void;
}

export default function NameStep({ onSubmit }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="step fade-in">
      <div className="step-icon">💝</div>
      <h1 className="step-title">Vòng Quay Tình Yêu</h1>
      <p className="step-desc">
        Chào mừng bạn đến với trò chơi quay thưởng lãng mạn nhất!
        Hãy nhập tên để bắt đầu nhé~
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-field"
          placeholder="Nhập tên của bạn..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={30}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim()}
        >
          Bắt đầu nào~
        </button>
      </form>
    </div>
  );
}
