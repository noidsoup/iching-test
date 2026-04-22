/** Classical line scores from divination (bottom line cast first). */
export const LINE = {
  OLD_YIN: 6,
  YOUNG_YANG: 7,
  YOUNG_YIN: 8,
  OLD_YANG: 9,
};

/** Yarrow stalk method: stationary probabilities for one line (one full ritual). */
export const YARROW_PROB = {
  [LINE.OLD_YIN]: 1 / 16,
  [LINE.YOUNG_YANG]: 5 / 16,
  [LINE.YOUNG_YIN]: 7 / 16,
  [LINE.OLD_YANG]: 3 / 16,
};

/** Three-coin method (heads = 3, tails = 2 per coin): each sum is equally likely at 1/8 except 6 and 9 are 1/8 too — actually 6,7,8,9 have probs 1/8, 3/8, 3/8, 1/8. */
export const COIN_SUM_PROB = {
  [LINE.OLD_YIN]: 1 / 8,
  [LINE.YOUNG_YANG]: 3 / 8,
  [LINE.YOUNG_YIN]: 3 / 8,
  [LINE.OLD_YANG]: 1 / 8,
};
