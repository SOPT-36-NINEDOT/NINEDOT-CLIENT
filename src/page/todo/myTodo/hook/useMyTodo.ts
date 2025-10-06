import { useState, useEffect } from 'react';

import type { CycleType } from '../constant/mock';

import type { TodoItemTypes } from '@/page/todo/myTodo/component/TodoBox/TodoBox.types';
import { formatDateDot } from '@/common/util/format';
import { useGetRecommendation } from '@/api/domain/myTodo/hook/useGetRecommendation';
import { usePostRecommendation } from '@/api/domain/myTodo/hook/usePostRecommendation';
import { useDeleteRecommendation } from '@/api/domain/myTodo/hook/useDeleteRecommendation';
import { useMandalartId } from '@/common/hook/useMandalartId';
import { useGetMandalartSubGoals } from '@/api/domain/myTodo/hook/useMyMandal';

interface UseMyTodoProps {
  initialDate?: Date;
  initialRecommendTodos?: TodoItemTypes[];
  initialMyTodos?: TodoItemTypes[];
}

export const useMyTodo = ({ initialDate }: UseMyTodoProps = {}) => {
  const defaultDate = initialDate ?? new Date();

  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [selectedCycle, setSelectedCycle] = useState<CycleType>();
  const [selectedParentId, setSelectedParentId] = useState<number>();
  const [recommendTodos, setRecommendTodos] = useState<TodoItemTypes[]>([]);

  const mandalartId = useMandalartId();
  const formattedDate = formatDateDot(currentDate);
  const isoDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    .toISOString()
    .split('T')[0];
  const { data: recommendationData, refetch } = useGetRecommendation(mandalartId, formattedDate);
  const { mutate: completeTodo } = usePostRecommendation();
  const { mutate: deleteTodo } = useDeleteRecommendation();

  useEffect(() => {
    if (recommendationData?.subGoals) {
      const formatted = recommendationData.subGoals.map((goal, index) => ({
        id: goal.id.toString(),
        content: goal.title,
        isCompleted: goal.isCompleted,
        completed: goal.isCompleted,
        cycle: goal.cycle as CycleType,
        parentId: 0,
        order: index,
      }));
      setRecommendTodos(formatted);
    }
  }, [recommendationData]);

  const { data: subGoalsMeta } = useGetMandalartSubGoals(
    mandalartId,
    selectedParentId,
    selectedCycle,
    isoDate,
  );

  const today = new Date();
  const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentNoTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const hasPreviousDate = Boolean(subGoalsMeta?.data?.isYesterdayExist);
  const hasNextDate = currentNoTime < todayNoTime;

  const handleDateChange = (newDate: Date) => {
    const today = new Date();
    const isFutureDate = newDate.getTime() > today.getTime();

    if (isFutureDate) {
      return;
    }
    setCurrentDate(newDate);
  };

  const handleCycleClick = (cycle: CycleType) => {
    setSelectedCycle(selectedCycle === cycle ? undefined : cycle);
  };

  const handleRecommendTodoClick = (item: TodoItemTypes) => {
    const isChecked = item.isCompleted;

    setRecommendTodos((prev) =>
      prev.map((todo) =>
        todo.id === item.id
          ? {
              ...todo,
              isCompleted: !todo.isCompleted,
              completed: !todo.isCompleted,
            }
          : todo,
      ),
    );
    if (isChecked) {
      deleteTodo(Number(item.id), {
        onSuccess: () => {
          refetch();
        },
      });
    } else {
      completeTodo(Number(item.id), {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  return {
    currentDate,
    selectedCycle,
    selectedParentId,
    setSelectedParentId,
    recommendTodos,
    hasPreviousDate,
    hasNextDate,
    handleDateChange,
    handleCycleClick,
    handleRecommendTodoClick,
  };
};
