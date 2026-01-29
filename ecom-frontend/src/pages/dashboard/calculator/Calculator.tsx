import { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input);
      setResult(evalResult);
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="max-w-xs mx-auto bg-white rounded-lg shadow p-6 mt-10">
      <h2 className="text-lg font-bold mb-4">Calculator</h2>
      <div className="mb-2 p-2 bg-gray-100 rounded text-right font-mono text-xl min-h-[2.5rem]">
        {input || "0"}
      </div>
      <div className="mb-4 p-2 bg-gray-50 rounded text-right font-mono text-lg min-h-[2rem] text-teal-600">
        {result}
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {[
          "7",
          "8",
          "9",
          "/",
          "4",
          "5",
          "6",
          "*",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          "=",
          "+",
        ].map((btn) => (
          <button
            key={btn}
            className="py-2 rounded bg-gray-200 hover:bg-gray-300 text-lg font-medium focus:outline-none"
            onClick={() => (btn === "=" ? handleCalculate() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}
      </div>
      <button
        className="w-full py-2 rounded bg-red-100 hover:bg-red-200 text-red-600 font-medium"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
}
