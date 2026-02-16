export interface Prize {
  id: number;
  name: string;
  emoji: string;
}

export const ALL_PRIZES: Prize[] = [
  { id: 1, name: 'Một nụ hôn kiểu Pháp mãnh liệt trong 5 phút ', emoji: '💋' },
  { id: 2, name: 'Thuê trọ ở chung với nhau', emoji: '🤗' },
  { id: 3, name: 'Hẹn hò cuối tuần', emoji: '🌹' },
  { id: 4, name: 'Neflixxx and chill cùng nhau', emoji: '🎬' },
  { id: 5, name: 'Nấu phở bò cho em ănnnnn', emoji: '🍳' },
  { id: 6, name: 'Massage thư giãn 2 tiếng', emoji: '💆' },
  { id: 7, name: 'Túi xách do anh lựa chọn', emoji: '👜' },
  { id: 8, name: 'Public dưới trăng kkk', emoji: '🌙' },
  { id: 9, name: 'Quà bất ngờ', emoji: '🎁' },
  { id: 10, name: 'Nhận lì xì ngẫu nhiên', emoji: '🧧' },
  { id: 11, name: 'Chụp 100 ảnh couple', emoji: '📸' },
  { id: 12, name: 'Karaoke song ca', emoji: '🎵' },
  { id: 13, name: 'Koithes and jolibee mỗi cuối tuầnnn', emoji: '🤞' },
  { id: 14, name: 'Du lịch 2 ngày', emoji: '🏖️' },
  { id: 15, name: 'Làm bất cứ việc gì mà em muốn', emoji: '🍰' },
  { id: 16, name: 'Kể 1 bí mật nhỏ', emoji: '🤫' },
  { id: 17, name: 'Ngày trọn vẹn bên nhau', emoji: '💕' },
];

export interface LoverOption {
  id: number;
  name: string;
  emoji: string;
  desc: string;
}

export const LOVER_OPTIONS: LoverOption[] = [
  { id: 1, name: 'Ghệ cu bự kkk', emoji: '🌧️', desc: 'Ngọt ngào và lãng mạn' },
  { id: 2, name: 'Ghệ đẹp troaiii', emoji: '💫', desc: 'Ai cũng phải mê mẩn' },
  { id: 3, name: 'Hoàng tử', emoji: '👑', desc: 'Sang chảnh và quyến rũ' },
  { id: 4, name: 'Baby cưng', emoji: '💕', desc: 'Đáng yêu nhất vũ trụ' },
];

export const WHEEL_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF',
  '#9B59B6', '#FF6B9D', '#00D2FF', '#FF4757', '#2ED573',
  '#FFA502',
];
