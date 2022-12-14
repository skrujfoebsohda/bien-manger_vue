import api from '@/services/airtable';
export default {
    namespaced: true,
    state: {
        recipes: [],
        recipesApi: [],
    },
    getters: {
        getRecipe(state) {
            return state.recipes;
        },

        getRecipePerSeason: (state) => (seasonId) => {
            let recipe = state.recipes.filter(recipe => recipe.Saison?.includes(seasonId));
            recipe = recipe.map(recipe => { return { id: recipe.id, name: recipe.Name, img: recipe.images } });
            return recipe;
        },

        getRecipePerId: (state) => (recipeId) => {
            return state.recipes.find(recipe => recipe.id == recipeId);
        },
        getRecipePerName: (state) => (recipeName) => {
            return state.recipes.find(recipe => recipe.Name === recipeName);
        }
    },
    mutations: {
        async fillRecipe(state) {
            let { records } = state.recipesApi

            // Décomposition des recettes.
            let recipes = records.map(record => { return { id: record.id, ...record.fields } })

            // Génération des ingrédients sur les recettes.
            let ingredients = await api.find({ resource: 'Recette_has_Ingredient', query: '' });
            ({ records } = ingredients)
            ingredients = records.map(record => { return { id: record.id, ...record.fields } })
            for (let r of recipes) {
                r.ingredients = ingredients.filter(i => i.Recette.includes(r.id))
            }

            // Association des images aux recettes
            let images = await api.find({ resource: 'Image', query: '' });
            ({ records } = images)
            images = records.map(record => { return { id: record.id, ...record.fields } })
            for (let r of recipes) {
                r.images = images.filter(i => i?.Recette?.includes(r.id))
            }

            // Défintiion des étapes
            let steps = await api.find({ resource: 'Etape', query: 'sort%5B0%5D%5Bfield%5D=NoEtape&sort%5B0%5D%5Bdirection%5D=asc' });
            ({ records } = steps)
            steps = records.map(record => { return { id: record.id, ...record.fields } })
            for (let r of recipes) {
                r.steps = steps.filter(i => i?.Recette?.includes(r.id))
            }

            //Définition du plats
            let meal = await api.find({ resource: 'Plat', query: '' });
            ({ records } = meal)
            meal = records.map(record => { return { id: record.id, ...record.fields } })
            for (let r of recipes) {
                r.meal = meal.filter(i => i?.Recette?.includes(r.id))
            }
            state.recipes = recipes;
        },
        setRecipesApi(state, data) {
            state.recipesApi = data;
        }
    },
    actions: {
        async checkRecipe({ commit, state }) {
            let result = await api.find({ resource: 'Recette', query: 'maxRecords=50' });
            commit('setRecipesApi', result);
            if (state.recipe != state.recipesApi) {
                commit('fillRecipe');
            }
        },
        // permet d'ajouter des étapes
        async addSteps(context, { recette, name, stepNumber, description }) {
            let recette_id = recette
            let objet = {
                records: [
                    {
                        fields: { Name: name, NoEtape: Number(stepNumber), Description: description, Recette: [recette_id] }
                    }
                ]
            }
            await api.create({ resource: 'Etape', data: objet })
        },
        async addRecipes(context, { name, description, season, meal }) {
            let object = {
                records: [
                    { fields: { Name: name, Description: description, Saison: [season], Plat: [meal] } }
                ]
            }
            await api.create({ resource: 'Recette', data: object })
        },

    }

}