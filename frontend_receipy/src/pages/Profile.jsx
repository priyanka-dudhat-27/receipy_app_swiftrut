import { useState, useContext, useEffect, useCallback } from "react";
import { FaCog, FaPlus } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import RecipeCard from "../components/RecipeCard";
import AddRecipeModal from "../components/AddRecipeModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout, checkLoginStatus } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${BASE_URL}/users/getUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      // console.log(response?.data?.data);
      setName(response?.data?.data?.name);
      setEmail(response?.data?.data?.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  }, [BASE_URL, user]);

  const fetchUserRecipes = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${BASE_URL}/Recipes/getUserRecipes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecipes(response.data.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      toast.error("Failed to fetch recipes");
    }
  }, [BASE_URL, user]);

  useEffect(() => {
    const initializeProfile = async () => {
      setIsLoading(true);
      if (user) {
        await Promise.all([fetchUserData(), fetchUserRecipes()]);
      } else {
        await checkLoginStatus();
        if (!user) {
          navigate("/signin");
        }
      }
      setIsLoading(false);
    };

    initializeProfile();
  }, [user, navigate, fetchUserData, fetchUserRecipes, checkLoginStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/users/delete/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      setShowDeleteConfirmation(false);
      setShowSettings(false);

      await logout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting account. Please try again.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/users/update/${user?._id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
      setShowSettings(false);
      checkLoginStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile. Please try again.");
    }
  };

  const handleAddRecipe = async (recipeData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/Recipes/register`, recipeData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Recipe added successfully");
      setShowAddRecipeModal(false);
      fetchUserRecipes();
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error(error.response?.data?.message || "Error adding recipe. Please try again.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaCog size={24} />
          </button>
          <h1 className="text-3xl font-bold mb-4">{user?.name}&apos;s Profile</h1>
          <p className="text-gray-600">Email: {email}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Recipes</h2>
            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Recipe</span>
            </button>
          </div>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onDelete={handleDeleteRecipe}
                  isProfilePage
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven&apos;t created any recipes yet.</p>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddRecipeModal && (
        <AddRecipeModal
          onClose={() => setShowAddRecipeModal(false)}
          onAddRecipe={handleAddRecipe}
        />
      )}
    </div>
  );
}
