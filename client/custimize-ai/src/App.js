import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
    };
    onSubmit(recipeData);
  };

  return (
    <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
        <div className="font-bold text-2xl mb-2 text-white text-center">
          Recipe Generator
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="ingredients"
          >
            Ingredients
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="mealType"
          >
            Meal Type
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 rounded shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="cuisine"
          >
            Cuisine Preference
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="cookingTime"
          >
            Cooking Time
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 rounded shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
            id="cookingTime"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          >
            <option value="Less than 30 minutes">Less than 30 minutes</option>
            <option value="30-60 minutes">30-60 minutes</option>
            <option value="More than 1 hour">More than 1 hour</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="complexity"
          >
            Complexity
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-300 rounded shadow-sm py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="flex items-center justify-center py-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="button"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  let eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream(); // Close any existing connection
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream(); // Close any existing connection
      initializeEventStream(); // Open a new connection
    }
  }, [recipeData]);

  // Function to initialize the event stream
  const initializeEventStream = () => {
    const recipeInputs = { ...recipeData };

    // Construct query parameters
    const queryParams = new URLSearchParams(recipeInputs).toString();
    // Open an SSE connection with these query parameters
    const url = `http://localhost:3001/recipeStream?${queryParams}`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.action === "close") {
        closeEventStream();
      } else if (data.action === "chunk") {
        setRecipeText((prev) => prev + data.chunk);
      }
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current.close();
    };
  };

  // Function to close the event stream
  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  async function onSubmit(data) {
    // update state
    setRecipeText("");
    setRecipeData(data);
  }

  return (
    <div className="App">
      <div className="flex flex-row h-full my-4 gap-2 justify-center">
        <RecipeCard onSubmit={onSubmit} />
        <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg box-recipi"><div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 font-bold text-2xl mb-2 text-white text-center">RecipeTex</div>
          {recipeText}
        </div>
      </div>
    </div>
  );
}

export default App;
