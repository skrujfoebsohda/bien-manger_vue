<template lang="">
    <NavBar class="navBar"></NavBar>
    <section class="flex column">
    <article>
        <div class="imgRecipe" :style="cssProps"></div> 
    </article>
    <article class="flex border column spaceAround paddingRecipe">
         <h1 class="widthTitle textCenter titleFont">{{ getRecipes?.Name }} </h1>
         <div class="flex spaceAround ">
             <ul class=" bgDarkGreenColor paddingRecipe flex column justifyCenter border">
            <li>{{getSeason?.name}}</li>
            <li v-for="meal in getRecipes?.meal" :key='meal'>{{meal?.Name}}</li>
         </ul>
           <ul class=" bgDarkGreenColor paddingRecipe border">
            <li v-for="ingredient in getRecipes?.ingredients" :key="ingredient">
            {{getIngredient(ingredient?.Ingredient[0])?.name}}: {{ingredient?.Quantity}} {{ingredient?.Unit}}
            </li>
           </ul>
         </div>
        <p>{{getRecipes?.Description}}</p>
           <ul v-for="step in getRecipes?.steps" :key='step'>
            <li>
                {{step?.NoEtape}}.{{step?.Name}}:<br>
                {{step?.Description}}
            </li>
            </ul>
    </article>
    </section>
<HomeFooter></HomeFooter>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import HomeFooter from '@/components/Home/Footer.vue';
export default {
    name: "RecipeShow",
    data() {
        return {
            result: '',
            id: this.$route.params.id,


        }
    },
    components: {
        NavBar,
        HomeFooter
    },
    computed: {
        getRecipes() {
            return this.$store.getters['recipe/getRecipePerId'](this.id);
        },
        cssProps() {
            let r = this.$store.getters['recipe/getRecipePerId'](this.id);
            let css = '';
            if (r && r.images && r.images.length > 0) { css = "background-image: url('" + r?.images[0]?.url + "')" }
            return css;
        },
        getSeason() {
            return this.$store.getters['season/getSeasonsPerId'](this.getRecipes?.Saison[0]);
        },
        getIngredient() {
            let that = this
            return (ingredientId) => {    
                return that.$store.getters['ingredient/getIngredientsPerId'](ingredientId)
            } 
        }
        
    },
    created() {
        this.$store.dispatch('recipe/checkRecipe');
        this.$store.dispatch('season/checkSeason');
        this.$store.dispatch('ingredient/checkIngredient');
    },
}
</script>

<style scoped>
.border {
    border-radius: 2rem;
}

h1 {
    margin-top: 2rem;
}

.paddingRecipe {
    padding: 1.5rem;
}


.imgRecipe {
    width: 100vw;
    height: 40vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: var(--img-recipe);
}

.bgDarkGreenColor {
    background-color: rgba(169, 191, 153, 0.5);
}

@media(min-width: 1024px) {
    .imgRecipe {
        width: 40vw;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-image: var(--img-recipe);
    }

    section {
        height: 100%;
        flex-direction: row;
    }

    .paddingRecipe {
        padding: 3rem;
    }
}
</style>