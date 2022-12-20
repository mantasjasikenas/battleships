import { useState } from 'react';
import LoggerService, {
  PatternTypes,
} from '../../services/LoggerService/LoggerService';

import './LoggerConfig.css';

export default function LoggerConfig() {
  const [_, setRerender] = useState(0);

  const patterns: number[] = [];

  for (const pattern in PatternTypes) {
    if (isNaN(Number(pattern))) {
      break;
    }

    patterns.push(Number(pattern));
  }

  return (
    <div className="logger-config-body vw-100 d-flex justify-content-center align-items-center">
      <div className="container d-flex flex-row justify-content-between m-5">
        {patterns.map((pattern, idx) => (
          <div className="d-flex border border-dark rounded p-1 m-1 " key={idx}>
            <span className="m-1">{PatternTypes[pattern]}</span>
            <input
              type="checkbox"
              checked={LoggerService.Instance.status(pattern)}
              onChange={() => {
                LoggerService.Instance.toggle(pattern);
                setRerender(Math.random());
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
