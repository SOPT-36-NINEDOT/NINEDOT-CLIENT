import { useState, useEffect } from 'react';

import * as styles from '../../MyTodo.css';
import type { MandalartData } from '../../constant/mock';

import {
  useGetMandalCoreGoals,
  useGetMandalartSubGoals,
} from '@/api/domain/myTodo/hook/useMyMandal';
import { useMandalartId } from '@/common/hook/useMandalartId';
import { useCheckSubGoal, useUncheckSubGoal } from '@/api/domain/myTodo/hook/useMyMandal';
import { CycleChip } from '@/page/todo/myTodo/component/CycleChip';
import { TodoBox } from '@/page/todo/myTodo/component/TodoBox';
import type { CycleType } from '@/page/todo/myTodo/component/CycleChip';
import type { TodoItemTypes } from '@/page/todo/myTodo/component/TodoBox/TodoBox.types';
import Mandalart from '@/common/component/Mandalart/Mandalart';

interface TodoCheckSectionProps {
  selectedCycle: CycleType | undefined;
  mandalartData: MandalartData;
  onCycleClick: (cycle: CycleType) => void;
  onTodoClick: (item: TodoItemTypes) => void;
  onMandalartClick: (parentId: number | undefined) => void;
  selectedParentId: number | undefined;
  currentDate?: Date;
}

const CYCLE_LIST: CycleType[] = ['DAILY', 'WEEKLY', 'ONCE'];

const CHECK_MESSAGES = {
  TITLE: '작은 성취를 체크하여 오늘을 완성해요',
  SUBTITLE: '만다라트를 클릭해서 목표별 할 일을 확인해보세요.',
};

const TodoCheckSection = ({
  selectedCycle,
  mandalartData,
  onCycleClick,
  onTodoClick,
  onMandalartClick,
  selectedParentId,
  currentDate,
}: TodoCheckSectionProps) => {
  const mandalartId = useMandalartId();
  const { data: coreGoalsData } = useGetMandalCoreGoals(mandalartId);
  const {
    data: subGoalResponse,
    isLoading: isSubGoalsLoading,
    isFetching: isSubGoalsFetching,
  } = useGetMandalartSubGoals(
    mandalartId,
    selectedParentId,
    selectedCycle,
    currentDate ? currentDate.toISOString().split('T')[0] : undefined,
  );

  const [localSubGoals, setLocalSubGoals] = useState<TodoItemTypes[]>([]);

  useEffect(() => {
    if (!subGoalResponse?.data) {
      return;
    }

    const apiSubGoals = (subGoalResponse.data.subGoals ?? []).map((goal) => ({
      id: goal.id,
      content: goal.title,
      cycle: goal.cycle,
      isCompleted: goal.isCompleted,
    }));

    setLocalSubGoals(apiSubGoals);
  }, [subGoalResponse]);

  const updateLocalSubGoalCompletion = (id: TodoItemTypes['id'], nextValue: boolean) => {
    setLocalSubGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, isCompleted: nextValue } : goal)),
    );
  };

  const checkSubGoalMutation = useCheckSubGoal();
  const uncheckSubGoalMutation = useUncheckSubGoal();

  const handleTodoClick = (item: TodoItemTypes) => {
    const today = new Date().toISOString().split('T')[0];
    const originalCompleted = Boolean(item.isCompleted);
    const nextCompleted = !originalCompleted;

    updateLocalSubGoalCompletion(item.id, nextCompleted);
    onTodoClick({ ...item, isCompleted: nextCompleted });

    if (originalCompleted) {
      uncheckSubGoalMutation.mutate(Number(item.id), {
        onError: () => {
          updateLocalSubGoalCompletion(item.id, originalCompleted);
        },
      });
    } else {
      checkSubGoalMutation.mutate(
        {
          subGoalId: Number(item.id),
          date: today,
        },
        {
          onError: () => {
            updateLocalSubGoalCompletion(item.id, originalCompleted);
          },
        },
      );
    }
  };

  const isLoadingSubGoals = isSubGoalsLoading || isSubGoalsFetching;
  const hasTodos = localSubGoals.length > 0;
  const showSpinner = isLoadingSubGoals;
  const todoContainerClass =
    showSpinner || hasTodos ? styles.todoCheckContainer : styles.noScrollTodoCheckContainer;

  const renderEmptyState = () => (
    <div className={styles.emptyTodoBox}>
      <span className={styles.emptyTodoText}>해당하는 할 일이 없어요</span>
    </div>
  );

  const renderTodoItems = () =>
    localSubGoals.map((todo) => (
      <div key={todo.id} className={styles.todoCheckLine}>
        <CycleChip type="display" value={todo.cycle as CycleType} />
        <TodoBox type="todo" items={[todo]} onItemClick={handleTodoClick} />
      </div>
    ));

  return (
    <section className={styles.checkSection}>
      <header className={styles.checkTextWrapper}>
        <h2 className={styles.checkTitle}>{CHECK_MESSAGES.TITLE}</h2>
        <p className={styles.checkSubtitle}>{CHECK_MESSAGES.SUBTITLE}</p>
      </header>

      <section className={styles.checkMainContainer}>
        <div className={styles.mandalartWithTodoSection}>
          <Mandalart
            type="TODO_MAIN"
            data={{
              id: 0,
              position: 4,
              title: mandalartData.title || mandalartData.mainGoal,
              subGoals: Array.isArray(coreGoalsData?.data?.coreGoals)
                ? [...coreGoalsData.data.coreGoals]
                    .sort((a, b) => a.position - b.position)
                    .map((goal) => ({
                      id: goal.id,
                      title: goal.title,
                      position: goal.position,
                      subGoals: [],
                    }))
                : [],
            }}
            onGoalClick={(position, goalId) => {
              const coreGoal = coreGoalsData?.data?.coreGoals.find(
                (goal) => goal.position === position,
              );
              const resolvedParentId = goalId && goalId > 0 ? goalId : coreGoal?.id;

              if (!resolvedParentId) {
                onMandalartClick(undefined);
                return;
              }

              onMandalartClick(
                selectedParentId === resolvedParentId ? undefined : resolvedParentId,
              );
            }}
          />
          <div className={styles.todoCheckArea}>
            <div className={styles.selectorChipsContainer}>
              {CYCLE_LIST.map((cycle) => (
                <CycleChip
                  key={cycle}
                  type="selector"
                  value={cycle}
                  selected={selectedCycle === cycle}
                  onClick={onCycleClick}
                />
              ))}
            </div>

            <div className={todoContainerClass}>
              {showSpinner && (
                <div className={styles.todoLoadingOverlay}>
                  <div className={styles.todoLoadingSpinner} />
                </div>
              )}
              {hasTodos ? renderTodoItems() : !showSpinner && renderEmptyState()}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export { TodoCheckSection };
