import './TwentyFivePlusFiveClock.css';
import {
  faArrowsRotate,
  faHeart,
  faMinus,
  faPause,
  faPlay,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

// adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export const TwentyFivePlusFiveClock = () => {
  const initialSessionLength = { mm: 25, ss: 0 };
  const initialBreakLength = { mm: 5, ss: 0 };
  let audio = document.getElementById('beep');

  const [sessionLength, setSessionLength] = useState(initialSessionLength);
  const [breakLength, setBreakLength] = useState(initialBreakLength);
  const [isCounting, setIsCounting] = useState(null);
  const [isBreak, setIsBreak] = useState(false);
  const [count, setCount] = useState(initialSessionLength);

  function resetAll() {
    setSessionLength(initialSessionLength);
    setBreakLength(initialBreakLength);
    setCount(initialSessionLength);
    setIsBreak(false);
    setIsCounting(false);
  }

  const savedCallback = useRef();

  // my actual countdown
  function callback() {
    // countdown reaches 00:00
    if (count.mm === 0 && count.ss === 0) {
      audio.play();
      setIsBreak(!isBreak);
      // reset count
      if (isBreak) {
        setCount({ ss: 0, mm: sessionLength.mm });
      } else {
        setCount({ ss: 0, mm: breakLength.mm });
      }
      // normal countdown
    } else if (count.ss === 0) {
      setCount({ mm: count.mm - 1, ss: 59 });
    } else {
      setCount({ ...count, ss: count.ss - 1 });
    }
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    // only run the timer when isCounting is active
    let delay = isCounting ? 1000 : null;
    if (isCounting && delay !== null) {
      // set initial counter
      let intervalId = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(intervalId);
    }
  }, [isCounting, count]);

  return (
    <div id="clockBox">
      <div className="heading">
        <h1>25 + 5 Clock</h1>
      </div>
      <div className="adjust">
        <div id="session-label">
          <h2>Session Length</h2>
          <button
            disabled={sessionLength.mm >= 60}
            id="session-increment"
            onClick={() =>
              setSessionLength({ ...sessionLength, mm: sessionLength.mm + 1 })
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <span id="session-length">{sessionLength.mm}</span>
          <button
            disabled={sessionLength.mm <= 1}
            id="session-decrement"
            onClick={() =>
              setSessionLength({ ...sessionLength, mm: sessionLength.mm - 1 })
            }
          >
            <FontAwesomeIcon icon={faMinus} />
            <i className="fa-solid fa-minus"></i>
          </button>
        </div>
        <div id="break-label">
          <h2>Break Length</h2>
          <button
            disabled={breakLength.mm >= 60}
            id="break-increment"
            onClick={() =>
              setBreakLength({ ...breakLength, mm: breakLength.mm + 1 })
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <span id="break-length">{breakLength.mm}</span>
          <button
            disabled={breakLength.mm <= 1}
            id="break-decrement"
            onClick={() =>
              setBreakLength({ ...breakLength, mm: breakLength.mm - 1 })
            }
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">
          {isBreak ? <span>Break</span> : <span>Session</span>}
        </h2>
        <p id="time-left">
          {`${count.mm.toString().padStart(2, 0)}:${count.ss
            .toString()
            .padStart(2, 0)}`}
        </p>
        <div className="controls">
          <button
            id="start_stop"
            onClick={() => {
              if (isCounting === null) {
                setCount(sessionLength);
              }
              setIsCounting(!isCounting);
            }}
          >
            {isCounting ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <button id="reset" onClick={() => resetAll()}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
          <audio id="beep" src="yipee.mp3" />
        </div>
      </div>
      <div className="author">
        <p>
          Designed and coded by <em>captainKathi</em> with{' '}
          <FontAwesomeIcon icon={faHeart} />
        </p>
      </div>
    </div>
  );
};
