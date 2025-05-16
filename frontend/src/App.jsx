import { useState } from "react";

function App() {
  const [code, setCode] = useState(`print("Hello, World!")`);
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, user_input: userInput }),
      });

      const data = await res.json();
      setOutput(data.output);
      setError(data.error);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🐍 Python Code Editor</h1>

        <label className="block mb-2 font-semibold">Code:</label>
        <textarea
          className="w-full bg-gray-800 p-4 rounded text-sm font-mono h-56 mb-6 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label className="block mb-2 font-semibold">User Input:</label>
        <input
          className="w-full bg-gray-800 p-3 rounded text-sm font-mono mb-6 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Input for your code (stdin)"
        />

        <button
          onClick={runCode}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold disabled:opacity-50 mb-6"
        >
          {loading ? "Running..." : "Run Code"}
        </button>

        <label className="block mb-2 font-semibold">Output:</label>
        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded min-h-[100px] border border-gray-700 whitespace-pre-wrap">
          {error
            ? `❌ Error:\n${error}`
            : output || "Output will appear here..."}
        </div>
      </div>
    </div>
  );
}

export default App;
