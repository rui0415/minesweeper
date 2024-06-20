import React, { useState } from 'react';
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

  // 0 = ゲーム中
  // 1 = ゲームクリア
  // 2 = ゲームオーバー
  const [clearCheck, setClearCheck] = useState(0);

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
    if (user_input[y][x] === 2) setFlagCount(flagCount + 1);
    user_input[y][x] = 1;
    if (board[y][x] === 0) {
      for (const dir of direction) {
        emptyCell(user_input, board, x + dir[1], y + dir[0]);
      }
    }
  };

  const clickHandler = (event: React.MouseEvent, x: number, y: number) => {
    event.preventDefault();
    if (clearCheck === 2) return;

    if (event.type === 'contextmenu') {
      const user_input = structuredClone(userInputs);
      if (user_input[y][x] === 0 && flagCount === 0) return;
      // user_input[y][x] = user_input[y][x] === 2 ? 0 : 2; // 2: フラグ
      if (user_input[y][x] === 2) {
        user_input[y][x] = 0;
        setFlagCount(flagCount + 1);
      } else {
        user_input[y][x] = 2;
        setFlagCount(flagCount - 1);
      }
      setUserInputs(user_input);
      return;
    } else if (event.type === 'click') {
      if (userInputs[y][x] === 2) return; // フラグが立っていたらクリックできない
      const user_input = structuredClone(userInputs);

      if (bombMap[y][x] === 1) {
        // ボムをクリックしたら

        setClearCheck(2);
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (bombMap[i][j] === 1) {
              user_input[i][j] = 1;
            }
          }
        }
        user_input[y][x] = 3;
        setUserInputs(user_input);
        return;
      }
      const input_flat = user_input.flat();
      const clickCount = input_flat.filter((v) => v === 1);
      if (clickCount.length === 0) {
        // 最初のクリックだったら
        const board = structuredClone(bombMap);
        let count = 0;
        while (count < bombAmount) {
          // マップのボムがbumbAmount個になるまで繰り返し
          const bumb_x = getRandomInt(0, 8);
          const bumb_y = getRandomInt(0, 8);
          if (bumb_x !== x && bumb_y !== y && board[bumb_y][bumb_x] !== 1) {
            // ボムが置ける場所だったら
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
        return;
      }
      emptyCell(user_input, bombMap, x, y);
      setUserInputs(user_input);
      const input_flat2 = user_input.flat();
      const clickCountAgain = input_flat2.filter((v) => v === 1);
      if (clickCountAgain.length === 81 - bombAmount) setClearCheck(1);
    }
    return;
  };

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

        {clearCheck > 0 && (
          <div className={styles.endgame}>
            <div>タイム：秒</div>
            <div>予想タイム：</div>
            <div>3BV : </div>
            <div>3BV/s : </div>
            <div>クリック数：</div>
            <div>効率：</div>
            <hr />
            <div>経験：</div>
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
                  style={{ backgroundPosition: `-${(30 * 0) % 300}px 0` }}
                />
                <div
                  className={styles.timerImg}
                  style={{ backgroundPosition: `-${(30 * 0) % 300}px 0` }}
                />
                <div
                  className={styles.timerImg}
                  style={{ backgroundPosition: `-${(30 * 0) % 300}px 0` }}
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
