import * as styles from './MyTodo.css';
import { RecommendSection } from './component/RecommendSection/RecommendSection';
import { TodoCheckSection } from './component/TodoCheckSection/TodoCheckSection';
import { useMyTodo } from './hook/useMyTodo';
import { DEFAULT_MANDALART_DATA } from './constant/mock';
import type { MandalartData } from './constant/mock';

import { DatePicker } from '@/page/todo/myTodo/component/DatePicker';
import type { TodoItemTypes } from '@/page/todo/myTodo/component/TodoBox/TodoBox.types';
import { useGetMandalAll } from '@/api/domain/myTodo/hook/useMyMandal';
import { useMandalartId } from '@/common/hook/useMandalartId';

interface MyTodoProps {
  mandalartData?: MandalartData;
  selectedDate?: Date;
  initialRecommendTodos?: TodoItemTypes[];
  initialMyTodos?: TodoItemTypes[];
}

const MyTodo = ({
  mandalartData,
  selectedDate,
  initialRecommendTodos,
  initialMyTodos,
}: MyTodoProps) => {
  const {
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
  } = useMyTodo({
    initialDate: selectedDate,
    initialRecommendTodos,
    initialMyTodos,
  });

  const mandalartId = useMandalartId();
  const { data } = useGetMandalAll(mandalartId);
  return (
    <>
      <div className={styles.myTodoBg} />
      <main className={styles.myTodoContainer}>
        <div className={styles.contentWrapper}>
          <section className={styles.datePickerSection}>
            <DatePicker
              currentDate={currentDate}
              onDateChange={handleDateChange}
              hasPrev={hasPreviousDate}
              hasNext={hasNextDate}
            />
          </section>
          <section className={styles.mainContentWrapper}>
            <RecommendSection
              recommendTodos={recommendTodos}
              onTodoClick={handleRecommendTodoClick}
            />
            <TodoCheckSection
              selectedCycle={selectedCycle}
              mandalartData={{
                ...(mandalartData || DEFAULT_MANDALART_DATA),
                title: data?.title || mandalartData?.title || DEFAULT_MANDALART_DATA.title,
              }}
              onCycleClick={handleCycleClick}
              onTodoClick={() => {}}
              onMandalartClick={setSelectedParentId}
              selectedParentId={selectedParentId}
              currentDate={currentDate}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default MyTodo;
