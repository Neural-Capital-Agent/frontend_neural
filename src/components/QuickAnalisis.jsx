import React, { useState, useCallback } from "react";

const QuickAdvice = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    const kwargs = { "user_id": localStorage.getItem("userId") };

    const url = new URL("http://localhost:8000/api/v1/crew/quick-advice");
    url.searchParams.append("args", question);
    url.searchParams.append("user_id", localStorage); 
    url.searchParams.append("kwargs", JSON.stringify(kwargs));

    fetch(url.toString(), {
      method: "POST", // Changed to POST since we're using query parameters
      headers: {
        "accept": "application/json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      console.log("Quick Advice Response:", data);
      setResponse(data);
      setQuestion(""); // Clear the input after successful submission
    })
    .catch(error => {
      console.error("Error:", error);
      setError("Failed to get advice. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [question]);

  return (
    <div className="bg-[#1A1D29] rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-slate-300 mb-2">
            Your Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., Should I invest in tech stocks given the current market conditions?"
            className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] min-h-[120px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className={`w-full py-3 px-6 rounded-xl font-bold transition duration-200 ${
            loading || !question.trim()
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90"
          }`}
        >
          {loading ? "Analyzing..." : "Get Analysis"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-[#10131C] border border-[#2D3348] rounded-lg">
          <h3 className="text-lg font-semibold text-[#F59E0B] mb-2">Analysis Result</h3>
          <div className="text-white whitespace-pre-line">
            {response.advice || response.message || JSON.stringify(response, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAdvice;