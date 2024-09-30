import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import RecipeCard from "../components/RecipeCard";
import { motion } from "framer-motion";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { isLoggedIn, user, loading } = useContext(AuthContext);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Recipes/getAllRecipes`);
        const fetchedRecipes = response.data.data;
        setRecipes(fetchedRecipes);

        const uniqueCuisines = [
          ...new Set(fetchedRecipes.map((recipe) => recipe.cuisine).filter(Boolean)),
        ];
        setCuisines(uniqueCuisines);
      } catch (error) {
        toast.error("Failed to fetch recipes");
      }
    };

    fetchRecipes();
  }, [BASE_URL]);

  const filteredRecipes = recipes.filter((recipe) => {
    const cuisineMatch =
      recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const titleMatch =
      recipe.title && recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    return cuisineMatch || titleMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-blue-800 mb-8"
        >
          Delicious Recipes from Around the World
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          {isLoggedIn ? (
            <p className="text-blue-600">
              Welcome back, <span className="font-semibold">{user?.name || "User"}</span>!
            </p>
          ) : (
            <p className="text-blue-600">
              Please <span className="font-semibold">sign in</span> to manage your recipes.
            </p>
          )}
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="max-w-md mx-auto">
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Search cuisines or recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Cuisine tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {cuisines.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchTerm(cuisine)}
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200"
            >
              {cuisine}
            </motion.button>
          ))}
        </motion.div>

        {/* Recipe grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-blue-600">
              No recipes found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}