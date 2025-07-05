import { useState } from 'react';

import * as styles from './AiRecommendModal.css';

import CloseIcon from '@/assets/svg/modal_delete.svg';
import CheckboxDefault from '@/assets/svg/checkbox_default.svg';
import CheckboxChecked from '@/assets/svg/checkbox_checked.svg';

const options = [
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜1',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜2',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜3',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜4',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜5',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜6',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜7',
  '와 이거 진짜같은데 와이거 진짜같은데 와 이거 진짜8',
];

const AiRecommendModal = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <img src={CloseIcon} alt="닫기 아이콘" className={styles.closeIcon} />
        </div>
        <p className={styles.title}>AI가 추천해 준 할 일이에요!</p>
        <p className={styles.subtitle}>
          최대 <span className={styles.highlight}>7개</span>까지 선택할 수 있어요
        </p>
        <div className={styles.listWrapper}>
          {options.map((option) => {
            const isChecked = selectedOptions.includes(option);
            return (
              <div
                key={option}
                className={styles.listItem}
                role="button"
                tabIndex={0}
                onClick={() => toggleOption(option)}
              >
                <img
                  src={isChecked ? CheckboxChecked : CheckboxDefault}
                  alt={isChecked ? '선택됨' : '미선택'}
                  className={styles.checkboxIcon}
                />
                <span>{option}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiRecommendModal;
