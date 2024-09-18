import "./CommandInput.css";

import { Interpreter } from "../../services/CommandInterpreter/Interpreter/Interpreter";
import { useEffect } from "react";

const INPUT_PROMPT_MESSAGE = "Command:";

export default function CommandInput() {
  let interpreter: Interpreter;

  useEffect(() => {
    interpreter = new Interpreter();
  }, []);

  function onInputOpen() {
    const input = prompt(INPUT_PROMPT_MESSAGE);

    if (!input) {
      return;
    }

    interpreter.interpret(input);
  }

  return (
    <div className="command-input">
      <i className="icon bi bi-code-slash" onClick={onInputOpen}></i>
    </div>
  );
}
