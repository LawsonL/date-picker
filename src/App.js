import React, { useState } from 'react';
import './style.css';
import styles from './Calendar.module.scss';

export default function App() {
  return (
    <div>
      <h1>Date picker!</h1>
      <Calendar />
    </div>
  );
}

const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, index) => {
    return new Date(0, index).toLocaleString('default', { month: 'short' });
  });

  const years = Array.from({ length: 201 }, (_, index) => 1900 + index);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div className={styles['month-year']}>
          <select
            className={styles.month}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>
          <select
            className={styles.year}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((yearNumber) => (
              <option key={yearNumber} value={yearNumber}>
                {yearNumber}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['nav-button']}>
          <button className={styles.arrow}>{'<'}</button>
          <button className={styles.arrow}>{'>'}</button>
        </div>
      </div>
      <div className={styles.weekdays}>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
        <div>Su</div>
      </div>
      <div className={styles['dates-grid']}>
        {/* You will dynamically generate date cells here */}
        {/* Placeholder for dates */}
        {Array.from({ length: 35 }, (_, i) => (
          <div className={`${styles['date-cell']}`} key={i}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <button className={`${styles.button} ${styles.today}`}>Today</button>
        <button className={`${styles.button} ${styles.tomorrow}`}>
          Tomorrow
        </button>
      </div>
    </div>
  );
};
