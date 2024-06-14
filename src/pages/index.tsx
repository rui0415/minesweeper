import { useState } from 'react';
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

  const bumbAmount = 10;

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const clickHandler = (input: number, x: number, y: number) => {
    const user_input = structuredClone(userInputs);
    if (!user_input[y][x]) {
      // クリックしたところが空白だったら。
      user_input[y][x] = 1;
      const input_flat = user_input.flat();
      const firstClickCheck = input_flat.filter((v) => v === 1);
      if (firstClickCheck.length === 1) {
        // 最初のクリックだったら
        let i = 0;
        const board = structuredClone(bombMap);
        while (i < bumbAmount) {
          // マップのボムがbumbAmount個になるまで繰り返し
          const bumb_x = getRandomInt(0, 8);
          const bumb_y = getRandomInt(0, 8);
          if (bumb_x !== x && bumb_y !== y && board[bumb_y][bumb_x] !== 1) {
            // ボムが置ける場所だったら
            i++;
            board[bumb_y][bumb_x] = 1;
          }
        }
        setBombMap(board);
        setUserInputs(user_input);
        return;
      } else {
        // 初回のクリックでなければ
        setUserInputs(user_input);
        return;
      }
    } else {
      // すでにクリックしたことがあるマスをクリックしたら
      return;
    }
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

        <div>
          <div className={styles.gameBoard}>
            {/* ボードの中のヘッダー部分。ボムの数やニコちゃんマーク、タイマー */}
            <div className={styles.gameBoardHeader}>
              <div className={styles.flagCount}>000</div>
              <div className={styles.gameIcon}>
                <div className={styles.icon} style={{ backgroundPosition: `-330px 0` }} />
              </div>
              <div className={styles.timer}>000</div>
            </div>

            {/* マップ */}
            <div className={styles.gameBoardMap}>
              {bombMap.map((row, y) =>
                row.map((bombCount, x) => (
                  <div
                    className={styles.cell}
                    onClick={(e) => clickHandler(e.button, x, y)}
                    key={`${x}-${y}`}
                  >
                    {bombCount === 1 && (
                      <div
                        className={styles.bomb}
                        style={{
                          backgroundPosition: bombCount === 1 ? `-300px 0` : `-330px 0`,
                        }}
                      />
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
