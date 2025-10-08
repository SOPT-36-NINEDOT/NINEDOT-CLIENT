import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { uncheckSubGoal, checkSubGoal } from './../index';
import { getMandalAll } from '../../mandalAll';
import { getMandalCoreGoals } from '..';
import type { CoreGoal } from '../type/myTodo';
import { getSubGoals } from '../../edit';

import type { CycleType } from '@/page/todo/myTodo/component/CycleChip';
import type { BaseResponse } from '@/type/api';
import { QUERY_KEY } from '@/api/constant/queryKey';

type MandalCoreGoalsResponse = BaseResponse<{
  coreGoals: CoreGoal[];
}>;

export const useGetMandalAll = (mandalartId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.ENTIRE_GOAL, mandalartId],
    queryFn: () => getMandalAll(mandalartId),
    enabled: !!mandalartId,
  });
};

export const useGetMandalCoreGoals = (mandalartId: number) => {
  return useQuery<MandalCoreGoalsResponse>({
    queryKey: [QUERY_KEY.CORE_GOALS, mandalartId],
    queryFn: () => getMandalCoreGoals(mandalartId),
    enabled: !!mandalartId,
  });
};

export const useGetMandalartSubGoals = (
  mandalartId: number,
  coreGoalId?: number,
  cycle?: string,
  date?: string,
) => {
  return useQuery({
    queryKey: [...QUERY_KEY.MANDALART_SUB_GOALS(mandalartId, coreGoalId, cycle), date],
    queryFn: () => getSubGoals(mandalartId, coreGoalId, cycle as CycleType, date),
    enabled: !!mandalartId,
  });
};

export const useCheckSubGoal = () => {
  return useMutation({
    mutationFn: ({ subGoalId, date }: { subGoalId: number; date: string }) =>
      checkSubGoal(subGoalId, date),
  });
};

export const useUncheckSubGoal = () => {
  return useMutation({
    mutationFn: (subGoalId: number) => uncheckSubGoal(subGoalId),
  });
};
