export type RecommendationSubGoal = {
  id: number;
  title: string;
  cycle: string;
  isCompleted: boolean;
};

export type RecommendationResponse = {
  subGoals: RecommendationSubGoal[];
  isYesterdayExist?: boolean;
};
