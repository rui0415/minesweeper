import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [sampleVal, setSampleVal] = useState(0);
  console.log(sampleVal);

  return (
    <div className={styles.container}>
      <div
        className={styles.sampleStyle}
        style={{ backgroundPosition: `-${30 * sampleVal}px 0` }} // cssスプライト
      />
      <button onClick={() => setSampleVal((Val) => (Val + 1) % 14)}>Sample</button>
    </div>
  );
};

export default Home;
