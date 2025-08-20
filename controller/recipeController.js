const Recipes = require("../models/recipeModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage })

// ========================================= VIEW ALL RECIPES =========================================

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find().populate("createdBy", "email");
    return res.status(201).json(recipes);
  } catch (error) {
    console.error("Error retrieving all recipes: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========================================= VIEW RECIPE BY USER-ID =========================================

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    return res.status(201).json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe by ID: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========================================= ADD RECIPE =========================================

const addRecipe = async (req, res) => {
  console.log(req.user);
  try {
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions) {
      return res
        .status(400)
        .json({ message: "Required fields cannot be empty" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id
    });
    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding recipe: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========================================= EDIT RECIPE =========================================

const editRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    let recipe = await Recipes.findById(req.params.id);

    if (recipe) {
      let coverImage = req.file?.filename ? req.file?.filename : recipe.coverImage
      await Recipes.findByIdAndUpdate(req.params.id, {...req.body, coverImage}, { new: true });
      return res.status(201).json(title, ingredients, instructions, time);
    }
  } catch (error) {
    console.error("Error retrieving recipe by ID: ", error);
    return res.status(404).json({ message: "Recipe update error" });
  }
};

// ========================================= DELETE RECIPE =========================================

const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({_id: req.params.id})
    res.json({status:"ok"})
  } catch (error) {
    return res.status(400).json({ message: "Recipe delete error" });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
