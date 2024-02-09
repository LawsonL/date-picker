import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import styles from "./Calendar.module.scss";
import moment from "moment";

export default function App() {
  const defaultDate = null;
  const defaultDateMoment = defaultDate ? moment(defaultDate) : null;
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInput, setDateInput] = useState(
    defaultDateMoment?.format("DD/MM/YYYY") ?? ""
  );
  const [selectedDate, setSelectedDate] = useState(defaultDateMoment); // Date object to pass to Calendar
  const inputRef = useRef(null); // Ref for the input

  const calendarRef = useRef(null); // Ref for the calendar

  useEffect(() => {
    // Function to detect click outside
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setDateInput(e.target.value);
    const parsedDate = moment(e.target.value, "DD/MM/YYYY", true);
    if (parsedDate.isValid()) {
      setSelectedDate(parsedDate.toDate());
    }
  };

  const handleCalendarChange = (date) => {
    // Format the selected date and update input
    setDateInput(moment(date).format("DD/MM/YYYY"));
    setSelectedDate(date);
    setShowCalendar(false);
  };
  return (
    <div className="App">
      <h1>Single Date Select</h1>
      <div className="date-picker-container">
        <input
          ref={inputRef}
          type="text"
          value={dateInput}
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
          onFocus={() => setShowCalendar(true)} // Show calendar when the input is focused
        />
        <button onClick={() => setShowCalendar(!showCalendar)}>
          {/* Insert your calendar icon here */}
        </button>
        {showCalendar && (
          <div ref={calendarRef} style={{ width: "fit-content" }}>
            <Calendar date={selectedDate} onSelect={handleCalendarChange} />
          </div>
        )}
      </div>
    </div>
  );
}

const Calendar = ({ date, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(date ? moment(date) : null); // New state for the selected date

  const [dateContext, setDateContext] = useState(
    date ? moment(date) : moment()
  );
  const month = dateContext.month();
  const year = dateContext.year();

  const today = moment();

  const firstDayOfMonth = moment(dateContext).startOf("month");
  const lastDayOfMonth = moment(dateContext).endOf("month");
  const daysInMonth = moment(dateContext).daysInMonth();

  const onDateClick = (day) => {
    setSelectedDate(moment(dateContext).date(day)); // Set the selected date
    onSelect(moment(dateContext).date(day));
  };

  let lastMonthDays = [];
  for (
    let i = 1;
    i <
    (Number(firstDayOfMonth.format("d")) == 0
      ? 7
      : Number(firstDayOfMonth.format("d")));
    i++
  ) {
    const lastMonthDay = firstDayOfMonth.clone().subtract(i, "day").date();
    lastMonthDays.push(
      <div className={`${styles["date-cell"]}`} key={`last-month-${i}`}>
        {lastMonthDay}
      </div>
    );
  }
  lastMonthDays = lastMonthDays.reverse();
  // Generate date cells for the days of the month
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    let day = d.toString();
    let todayClass = today.isSame(moment(dateContext).date(d), "day")
      ? styles.today
      : "";
    let isSelected =
      selectedDate && selectedDate.isSame(moment(dateContext).date(d), "day");
    let selectedClass = isSelected ? styles.selected : "";
    days.push(
      <div
        className={`${styles["date-cell"]} ${todayClass} ${selectedClass} ${styles["current-month"]}`}
        key={d}
        onClick={() => onDateClick(d)}
      >
        {day}
      </div>
    );
  }

  const NextMonthDays = [];
  for (
    let i = 1;
    i + Number(lastDayOfMonth.format("d")) <= 7 &&
    Number(lastDayOfMonth.format("d")) > 0;
    i++
  ) {
    console.log(
      "hey",
      i + Number(lastDayOfMonth.format("d")),
      Number(lastDayOfMonth.format("d"))
    );
    const nextMonthDay = lastDayOfMonth.clone().add(i, "day").date();
    NextMonthDays.push(
      <div className={`${styles["date-cell"]}`} key={`next-month-${i}`}>
        {nextMonthDay}
      </div>
    );
  }

  // Combine blanks and days to create the full grid
  const totalSlots = [...lastMonthDays, ...days, ...NextMonthDays];

  const months = Array.from({ length: 12 }, (_, index) => {
    return new Date(0, index).toLocaleString("default", { month: "short" });
  });

  const years = Array.from({ length: 201 }, (_, index) => 1900 + index);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div className={styles["month-year"]}>
          <select
            className={styles.month}
            value={month}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value, 10);
              setDateContext(moment(dateContext).month(newMonth));
            }}
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
            onChange={(e) => {
              const newYear = parseInt(e.target.value, 10);
              setDateContext(moment(dateContext).year(newYear));
            }}
          >
            {years.map((yearNumber) => (
              <option key={yearNumber} value={yearNumber}>
                {yearNumber}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["nav-button"]}>
          <button
            className={styles.arrow}
            onClick={() => {
              setDateContext(dateContext.clone().subtract(1, "month"));
            }}
          >
            {"<"}
          </button>
          <button
            className={styles.arrow}
            onClick={() => {
              setDateContext(dateContext.clone().add(1, "month"));
            }}
          >
            {">"}
          </button>
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
      <div className={styles["dates-grid"]}>{totalSlots}</div>
      <div className={styles.footer}>
        <button
          className={`${styles.button} ${styles.today}`}
          onClick={() => {
            const today = moment();
            setDateContext(today);
            setSelectedDate(today);
            onSelect(today);
          }}
        >
          Today
        </button>
        <button
          className={`${styles.button} ${styles.tomorrow}`}
          onClick={() => {
            const tomorrow = moment().add(1, "day");
            setDateContext(tomorrow);
            setSelectedDate(tomorrow);
            onSelect(tomorrow);
          }}
        >
          Tomorrow
        </button>
      </div>
    </div>
  );
};
