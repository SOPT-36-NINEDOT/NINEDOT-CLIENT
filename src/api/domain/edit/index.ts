import axiosInstance from '@/api/axiosInstance';
import { END_POINT } from '@/api/constant/endPoint';
import type { BaseResponse } from '@/type/api';

interface GoalIdPosition {
  id: number;
  position: number;
}

interface CoreGoalIdsResponse {
  coreGoalIds: GoalIdPosition[];
}

interface CoreGoal {
  id: number;
  title: string;
  position: number;
  aiGeneratable: boolean;
}

interface CoreGoalsResponse {
  coreGoals: CoreGoal[];
}

type CycleType = 'DAILY' | 'WEEKLY' | 'ONCE';

export interface SubGoal {
  [x: string]: any;
  id: number;
  title: string;
  position: number;
  cycle: CycleType;
}

export interface SubGoalsResponse {
  subGoals: SubGoal[];
  isYesterdayExist?: boolean;
}

// 상위 목표 id, position 조회 API
export const getUpperGoalIds = async (
  mandalartId: number,
): Promise<BaseResponse<CoreGoalIdsResponse>> => {
  const response = await axiosInstance.get<BaseResponse<CoreGoalIdsResponse>>(
    `${END_POINT.MANDALART}/${mandalartId}/core-goals/id-positions`,
  );
  return response.data;
};

// 상위 목표 정보 조회 API
export const getCoreGoals = async (
  mandalartId: number,
): Promise<BaseResponse<CoreGoalsResponse>> => {
  const response = await axiosInstance.get<BaseResponse<CoreGoalsResponse>>(
    `${END_POINT.MANDALART}/${mandalartId}/core-goals`,
  );
  return response.data;
};

// 하위 목표 조회 API
export const getSubGoals = async (
  mandalartId: number,
  coreGoalId?: number,
  cycle?: CycleType,
  date?: string,
): Promise<BaseResponse<SubGoalsResponse>> => {
  const queryParams = new URLSearchParams();
  if (coreGoalId !== undefined) {
    queryParams.append('coreGoalId', coreGoalId.toString());
  }
  if (cycle) {
    queryParams.append('cycle', cycle);
  }
  if (date) {
    queryParams.append('date', date);
  }

  const queryString = queryParams.toString();
  const url = `${END_POINT.MANDALART}/${mandalartId}/sub-goals${queryString ? `?${queryString}` : ''}`;

  const response = await axiosInstance.get<BaseResponse<SubGoalsResponse>>(url);
  return response.data;
};

export interface UpdateSubGoalRequest {
  coreGoal: {
    position: number;
    title: string;
  };
  subGoals: {
    position: number;
    title: string;
    cycle: CycleType;
  }[];
}

export interface UpdateSubGoalResponse {
  success: boolean;
}

export const updateSubGoal = async (
  mandalartId: number,
  data: UpdateSubGoalRequest,
): Promise<UpdateSubGoalResponse> => {
  const response = await axiosInstance.patch<UpdateSubGoalResponse>(
    `${END_POINT.MANDALART}/${mandalartId}/core-goals`,
    data,
  );
  return response.data;
};
