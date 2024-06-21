import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const direction = [
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const bombAmount = 10;
  // 0 = ゲーム中
  // 1 = ゲームクリア
  // 2 = ゲームオーバー
  const [clearCheck, setClearCheck] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [flagCount, setFlagCount] = useState(bombAmount);

  const resetGame = () => {
    const board = structuredClone(bombMap);
    const user_input = structuredClone(userInputs);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i][j] = 0;
        user_input[i][j] = 0;
      }
    }
    setBombMap(board);
    setUserInputs(user_input);
    setClearCheck(0);
    setTime(0);
    setIsRunning(false);
    setFlagCount(bombAmount);
    return;
  };

  const handleGameIconClick = () => {
    const gameIconElement = document.querySelector(`.${styles.gameIcon}`);
    if (gameIconElement) {
      gameIconElement.classList.add(styles.active);
      setTimeout(() => {
        gameIconElement.classList.remove(styles.active);
        resetGame();
      }, 250);
    }
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const checkRange = (x: number, y: number) => {
    return 0 <= x && x < 9 && 0 <= y && y < 9;
  };

  const emptyCell = (user_input: number[][], board: number[][], x: number, y: number) => {
    if (!checkRange(x, y) || user_input[y][x] === 1) {
      return;
    }
    if (user_input[y][x] === 2) setFlagCount((prevFlagCount) => prevFlagCount + 1);
    user_input[y][x] = 1;
    if (board[y][x] === 0) {
      for (const dir of direction) {
        emptyCell(user_input, board, x + dir[1], y + dir[0]);
      }
    }
  };

  const gameSetCheck = (x: number, y: number, user_input: number[][]) => {
    if (bombMap[y][x] === 1) {
      // ボムをクリックしたら負け

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (bombMap[i][j] === 1) {
            user_input[i][j] = 1;
          }
        }
      }
      user_input[y][x] = 3;
      setUserInputs(user_input);
      setClearCheck(2);
      setIsRunning(false);
      return 1;
    }
    return 0;
  };

  const clickHandler = (event: React.MouseEvent, x: number, y: number) => {
    event.preventDefault();
    if (clearCheck === 2) return;

    if (event.type === 'contextmenu') {
      const user_input = structuredClone(userInputs);
      if (user_input[y][x] === 0 && flagCount === 0) return;
      if (user_input[y][x] === 2) {
        user_input[y][x] = 0;
        setFlagCount((prevFlagCount) => prevFlagCount + 1);
      } else {
        user_input[y][x] = 2;
        setFlagCount((prevFlagCount) => prevFlagCount - 1);
      }
      setUserInputs(user_input);
      return;
    } else if (event.type === 'click') {
      if (userInputs[y][x] === 2) return; // フラグが立っていたらクリックできない
      const user_input = structuredClone(userInputs);

      const input_flat = user_input.flat();
      const clickCount = input_flat.filter((v) => v === 1);

      // 最初のクリックだったら
      if (clickCount.length === 0) {
        const board = structuredClone(bombMap);
        let count = 0;

        // マップのボムがbumbAmount個になるまで繰り返し
        while (count < bombAmount) {
          const bumb_x = getRandomInt(0, 8);
          const bumb_y = getRandomInt(0, 8);

          // ボムが置ける場所だったら
          if (bumb_x !== x && bumb_y !== y && board[bumb_y][bumb_x] !== 1) {
            count++;
            board[bumb_y][bumb_x] = 1;
          }
        }

        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (board[i][j] === 1) {
              // 全セルみて、そのセルが爆弾だったら
              for (const dir of direction) {
                if (checkRange(i + dir[0], j + dir[1]) && board[i + dir[0]][j + dir[1]] !== 1) {
                  // 8方向見て爆弾じゃないセルをプラス1する
                  if (board[i + dir[0]][j + dir[1]] === 0) {
                    // そのセルが爆弾が置かれていなかったら、+1する。
                    board[i + dir[0]][j + dir[1]] = 1;
                  }

                  board[i + dir[0]][j + dir[1]]++;
                }
              }
            }
          }
        }
        emptyCell(user_input, board, x, y);
        setBombMap(board);
        setUserInputs(user_input);
        setIsRunning(true);
        return;
      }

      // ボムをクリックしたら
      if (gameSetCheck(x, y, user_input)) return;

      emptyCell(user_input, bombMap, x, y);

      const input_flat2 = user_input.flat();
      const clickCountAgain = input_flat2.filter((v) => v === 1);

      // ゲームクリアしたら
      if (clickCountAgain.length === bombMap.length ** 2 - bombAmount) {
        setIsRunning(false);
        for (let i = 0; i < bombMap.length; i++) {
          for (let j = 0; j < bombMap.length; j++) {
            if (bombMap[i][j] === 1 && user_input[i][j] !== 2) user_input[i][j] = 2;
          }
        }
        setClearCheck(1);
      }
      setUserInputs(user_input);
    }
    return;
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className={styles.container}>
      <div className={styles.gameStyle}>
        {/* レベル選択 */}
        <div className={styles.gameHeader}>
          <div className={styles.easy}>初級</div>
          <div className={styles.normal}>中級</div>
          <div className={styles.hard}>上級</div>
          <div className={styles.custom}>カスタム</div>
        </div>

        {/* ゲームが終わったら */}
        {clearCheck > 0 && (
          <div className={styles.endgame}>
            <div>タイム：{time}秒</div>
          </div>
        )}

        <div>
          <div className={styles.gameBoard}>
            {/* ボードの中のヘッダー部分。ボムの数やニコちゃんマーク、タイマー */}
            <div className={styles.gameBoardHeader}>
              <div className={styles.flagCount}>
                <div
                  className={styles.flagImg}
                  style={{
                    backgroundPosition: `-${(((Math.floor(flagCount / 100) % 100) + 9) * 30) % 300}px 0`,
                  }}
                />
                <div
                  className={styles.flagImg}
                  style={{
                    backgroundPosition: `-${(((Math.floor(flagCount / 10) % 10) + 9) * 30) % 300}px 0`,
                  }}
                />
                <div
                  className={styles.flagImg}
                  style={{
                    backgroundPosition: `-${(((flagCount % 10) + 9) * 30) % 300}px 0`,
                  }}
                />
              </div>
              <div className={styles.gameIcon} onClick={() => handleGameIconClick()}>
                <div
                  className={styles.icon}
                  style={{ backgroundPosition: `-${330 + 30 * clearCheck}px 0` }}
                />
              </div>
              <div className={styles.timer}>
                <div
                  className={styles.timerImg}
                  style={{
                    backgroundPosition: `-${(((Math.floor(time / 100) % 100) + 9) * 30) % 300}px 0`,
                  }}
                />
                <div
                  className={styles.timerImg}
                  style={{
                    backgroundPosition: `-${(((Math.floor(time / 10) % 10) + 9) * 30) % 300}px 0`,
                  }}
                />
                <div
                  className={styles.timerImg}
                  style={{ backgroundPosition: `-${(((time % 10) + 9) * 30) % 300}px 0` }}
                />
              </div>
            </div>

            {/* マップ */}
            <div className={styles.gameBoardMap}>
              {bombMap.map((row, y) =>
                row.map((cell, x) => (
                  <div key={`${x}-${y}`}>
                    {(userInputs[y][x] === 0 || userInputs[y][x] === 2) && (
                      <div
                        className={styles.coverCell}
                        onClick={(e) => clickHandler(e, x, y)}
                        onContextMenu={(e) => clickHandler(e, x, y)}
                      >
                        {userInputs[y][x] === 2 && <div className={styles.coverCellIcon} />}
                      </div>
                    )}
                    {(userInputs[y][x] === 1 || userInputs[y][x] === 3) && (
                      <div className={styles.cell} onClick={(e) => clickHandler(e, x, y)}>
                        {cell > 0 && (
                          <div
                            className={styles.cellIcon}
                            style={{
                              backgroundPosition:
                                cell === 1 ? '-300px 0' : `-${(cell - 2) * 30}px 0`,
                              backgroundColor: userInputs[y][x] === 3 ? 'red' : '',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
