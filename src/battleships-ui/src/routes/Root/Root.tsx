import { Outlet } from 'react-router-dom';
import CommandInput from '../../components/CommandInput/CommandInput';
import LoggerConfig from '../../components/LoggerConfig/LoggerConfig';
import { MessageDisplay } from '../../components/MessageDisplay/MessageDisplay';

export default function Root() {
  return (
    <div>
      <div style={{ display: 'none' }}>
        <LoggerConfig />
      </div>
      <div className="mt-5 d-flex justify-content-center align-items-center">
        <Outlet />
      </div>
      <div style={{ display: 'none' }}>
        <CommandInput />
        <MessageDisplay />
      </div>
    </div>
  );
}
