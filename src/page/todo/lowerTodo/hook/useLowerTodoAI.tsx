import { isAxiosError } from 'axios';
import { useState } from 'react';

import { ALERT, GOAL_COUNT } from '@/common/constants/todo';
import { extractTitles, formatAiRecommendTitles } from '../utils/goal';

import AiRecommendModal from '@/common/component/AiRecommendModal/AiRecommendModal';
import AiFailModal from '@/common/component/AiFailModal/AiFailModal';
import { useOverlayModal } from '@/common/hook/useOverlayModal';
import { usePostAiRecommendNewSubGoal } from '@/api/domain/lowerTodo/hook';

interface TodoItem {
  title: string;
  cycle: 'DAILY' | 'WEEKLY' | 'ONCE';
}

interface UseLowerTodoAIParams {
  selectedCoreGoalId?: number;
  selectedCoreGoalTitle?: string;
  selectedGoalIndex: number;
  currentTodos: TodoItem[];
  setCurrentTodos: (todos: TodoItem[]) => void;
  setIsTooltipOpen: (open: boolean) => void;
  isAiUsed: boolean[];
  setIsAiUsed: (value: boolean[] | ((prev: boolean[]) => boolean[])) => void;
  handleTodoEnter: (index: number, todo: TodoItem) => void;
}

interface ApiErrorResponse {
  message?: string;
}
const CYCLE_MAP: Record<string, 'DAILY' | 'WEEKLY' | 'ONCE'> = {
  매일: 'DAILY',
  매주: 'WEEKLY',
  '한 번': 'ONCE',
};

const convertCycleToEnglish = (koreanCycle: string) => CYCLE_MAP[koreanCycle] ?? 'DAILY';

const getServerMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
export const useLowerTodoAI = ({
  selectedCoreGoalId,
  selectedCoreGoalTitle,
  selectedGoalIndex,
  currentTodos,
  setCurrentTodos,
  setIsTooltipOpen,
  isAiUsed,
  setIsAiUsed,
  handleTodoEnter,
}: UseLowerTodoAIParams) => {
  const { openModal, closeModal } = useOverlayModal();
  const postAiRecommendNew = usePostAiRecommendNewSubGoal();
  const [isLoading, setIsLoading] = useState(false);

  const handleAiSubmit = async (goals: { title: string }[]) => {
    if (!selectedCoreGoalId) {
      return;
    }

    const emptyIndices = currentTodos
      .map((todo, index) => (todo.title.trim() === '' ? index : -1))
      .filter((index) => index !== -1);

    const updatedTodos = [...currentTodos];
    const todoPromises: Promise<void>[] = [];

    goals.forEach((goal, goalIndex) => {
      if (goalIndex < emptyIndices.length) {
        const targetIndex = emptyIndices[goalIndex];
        const match = goal.title.match(/^(매일|매주|한 번)\/(.+)$/);
        const titleText = match ? match[2] : goal.title;
        const cycleText = match ? match[1] : '매일';

        const newTodo = {
          title: titleText,
          cycle: convertCycleToEnglish(cycleText),
        };

        updatedTodos[targetIndex] = newTodo;
        todoPromises.push(Promise.resolve(handleTodoEnter(targetIndex, newTodo)));
      }
    });

    await Promise.all(todoPromises);
    setCurrentTodos(updatedTodos);
    setIsAiUsed((prev) => {
      const newState = [...prev];
      newState[selectedGoalIndex] = true;
      return newState;
    });
  };

  const handleOpenAiModal = async () => {
    if (!selectedCoreGoalId) {
      alert('선택된 상위목표가 없습니다.');
      return;
    }

    const currentFilledCount = currentTodos.filter((todo) => todo.title.trim() !== '').length;
    const maxTodos = GOAL_COUNT;

    if (currentFilledCount >= maxTodos) {
      alert(ALERT.todosAlreadyFilled);
      return;
    }

    if (isAiUsed[selectedGoalIndex] || isLoading) {
      return;
    }

    const updateAiUsed = () => {
      setIsAiUsed((prev) => {
        const newState = [...prev];
        newState[selectedGoalIndex] = true;
        return newState;
      });
    };

    setIsLoading(true);
    setIsTooltipOpen(false);

    try {
      const currentSubGoals = extractTitles(
        currentTodos.filter((todo) => todo.title.trim() !== ''),
      ).map((title) => ({ title }));

      const response = await postAiRecommendNew.mutateAsync({
        coreGoalId: selectedCoreGoalId,
        coreGoal: selectedCoreGoalTitle || '선택된 상위목표',
        subGoal: currentSubGoals,
      });

      const recommendList = response.aiRecommendedList || [];
      const titles = formatAiRecommendTitles(recommendList);

      const aiModalContent = (
        <AiRecommendModal
          onClose={closeModal}
          onBeforeClose={updateAiUsed}
          onSubmit={handleAiSubmit}
          values={currentTodos.map((todo) => todo.title)}
          options={titles}
        />
      );

      openModal(aiModalContent);
    } catch (error) {
      const message = getServerMessage(error, ALERT.aiFetchFail);
      const failModalContent = <AiFailModal onClose={closeModal} message={message} />;
      openModal(failModalContent);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAiUsed, handleOpenAiModal } as const;
};
