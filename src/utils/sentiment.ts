import { NEGATIVE_SCORE_THRESHOLD } from '@/constants/news';

// 부정 뉴스인지 판정한다. 중립(0 근처)은 부정으로 보지 않는다
export const isNegative = (score: number) => score <= NEGATIVE_SCORE_THRESHOLD;
