import express from "express";
import { v4 } from "uuid";

import { pool } from "./services/database";
import { migrations } from "./services/migrations/migrations";
import user from "./routes/user";
import recipe from "./routes/recipe";
import admin from "./routes/admin";

const app = express();

app.use(user);
app.use(recipe);
app.use(admin);

app.get("/api", async (req, res) => {
  try {
    for (const migration of migrations) {
      await pool.query(migration);
    }

    res.json({ message: "Success!" });
  } catch (error) {
    res.json({ message: "Oh no something went wrong", error });
  }
});

app.get("/api/seed", async (req, res) => {
  const recipes = [
    {
      name: "Special Bicol Express",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://images.deliveryhero.io/image/foodpanda/recipes/bicol-express-recipe-1.jpg",
      description:
        "Combine ginger, garlic, onion, Thai chili pepper, pork, and coconut milk in a pan. Mix well. Cover the pan and turn the heat to on. Let the mixture boil. Remove the cover. Stir. Add half of the bagoong and pour around 1 cup of coconut cream and a cup of water. Stir and adjust the heat to low. Cook until the sauce reduces to a quarter (around 50 minutes). Add the remaining coconut cream and bagoong alamang (as needed). Also add the Serrano peppers. Continue cooking in low heat until the sauce thickens (around Transfer to a serving plate and serve with warm rice.",
      ingredients:
        "2 cups coconut cream\n2lbs. pork belly sliced into strips\n2 cups coconut milk\nGinger\nWater\nOnion\nGarlic\nThai chili",
    },
    {
      name: "Fried Egg",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://images.pexels.com/photos/722223/pexels-photo-722223.jpeg?auto=compress",
      description:
        "Start by heating a non-stick pan over medium heat. You can also add a small amount of butter or oil to the pan to prevent the egg from sticking. Crack an egg into a small bowl or ramekin. This makes it easier to pour the egg into the pan without breaking the yolk. Once the pan is heated, carefully pour the egg into the pan. Be sure to pour it gently so that the yolk doesn't break. Let the egg cook for 1-2 minutes or until the white is set and the edges are slightly crispy. You can cover the pan with a lid to help cook the top of the egg if you prefer a more well-done yolk. Use a spatula to carefully remove the egg from the pan and onto a plate. Serve immediately while the yolk is still runny.",
      ingredients: "Egg\nSalt\nPepper\nOil",
    },
    {
      name: "Thunder Sushi",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://www.pressurecookrecipes.com/wp-content/uploads/2021/02/california-roll.jpg",
      description:
        "Preheat the oven to 300 degrees F (150 degrees C).Bring water to a boil in a medium pot; stir in rice. Reduce heat to medium-low, cover, and simmer until rice is tender and water has been absorbed, 20 to 25 minutes.Mix rice vinegar, sugar, and salt in a small bowl. Gently stir into cooked rice in the pot and set aside.Lay nori sheets on a baking sheet.Heat nori in the preheated oven until warm, 1 to 2 minutes.Center 1 nori sheet on a bamboo sushi mat. Use wet hands to spread a thin layer of rice on top. Arrange 1/4 of the crabmeat, avocado, cucumber, and pickled ginger over rice in a line down the center. Lift one end of the mat and roll it tightly over filling to make a complete roll. Repeat with remaining ingredients.Use a wet, sharp knife to cut each roll into 4 to 6 slices.",
      ingredients:
        "1 ⅓ cups water\n⅔ cup uncooked short-grain white rice\n3 tablespoons rice vinegar\n3 tablespoons white sugar\n1 ½ teaspoons salt\n4 sheets nori seaweed sheets\n½ pound imitation crabmeat, flaked\n1 avocado - peeled, pitted, and sliced\n½ cucumber, peeled, cut into small strips\n2 tablespoons pickled ging",
    },
    {
      name: "Onigiri",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://cdn.britannica.com/97/234797-050-ADA29396/Okaka-salmon-onigiri.jpg",
      description:
        "Pop your cooked rice into a nice mixing bowl. Add the furikake or rice flavouring and mix through evenly. Separate the rice into equal portions, big enough to be a large handful each.Wet your hands with water and rub together with a pinch or two of salt. This stops the rice sticking to your hands and helps keep it fresher for longer.Take up one portion of rice in your hands.If you are hiding some fillings inside, here is where you make an indent, place the ingredients inside and fold the rice over, then lightly press into a ball.Using mainly your fingertips while resting the rice on your palm, start to press and squeeze the rice into a triangular shape, rotating as you go so it’s even.Place a slice of nori on the bottom of the onigiri (the rough side should face the rice) and fold it up towards to the middle of the onigiri.",
      ingredients: "Rice\nFurikake\nNori",
    },
    {
      name: "Blazing Natto",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://www.seriouseats.com/thmb/5tq4s51XldNh0LTAAuUbcfgWMVY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230407-SEA-Natto-LorenaMasso-10-5b754e0b7ab24136b86859d5cf984913.jpg",
      description:
        "Soak the soy beans overnight– it should expand and look plump. Discard the water and then cook the soy beans in an instant pot, pressure cooker or over the stove until tender. Lay cling wrap on a tray or shallow tupperware (this step is not essential but helps immensely with the clean up process). Sterilize any utensils and bowl with hot water to remove any bacteria. Drain the soybeans well and then add the soy beans to the tupperware.Add 1 tablespoon of filtered water into the pack of natto and mix to loosen. Then spread the natto over the soy beans and mix well. If using the starter, sprinkle the starter over and mix. If using previous batch, add the natto and mix well. Cover with paper towel, cling wrap and then elastic bands to secure.Place in a yogurt maker, fermentation box or a warm area at 40 C for 24 hours. The next day, place into the fridge and continue to ferment for another 24 hours.The natto is complete! Store in the fridge for up to 2 days or transfer to portioned size freezer safe reusable bags or tupperware. When ready to eat, thaw in the fridge and enjoy!You can repeat this process maximum 3 times with previous natto. Then you must use the frozen store bought natto (because the bacteria is stronger).",
      ingredients:
        "1 pack of frozen natto\n380g dry soy beans\n1 tbsp filtered water",
    },
    {
      name: "Chicken Adobo",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k/Edit/2022-10-Chicken-Adobo/Chicken_Adobo",
      description:
        "Combine chicken, soy sauce, and garlic in a large bowl. Mix well. Marinate the chicken for at least 1 hour. Note: the longer the time, the better(2 lbs chicken, 8 tablespoons soy sauce)Heat a cooking pot. Pour cooking oil.(3 tablespoons cooking oil)When the oil is hot enough, pan-fry the marinated chicken for 2 minutes per side.Pour-in the remaining marinade, including garlic. Add water. Bring to a boil(1 1/2 cups water)Add dried bay leaves and whole peppercorn. Simmer for 30 minutes or until the chicken gets tender(3 pieces dried bay leaves, 1 teaspoon whole peppercorn)Add vinegar. Stir and cook for 10 minutes.(4 tablespoons white vinegar)Put-in the sugar, and salt. Stir and turn the heat off.Serve hot.(1 teaspoon sugar, 1/4 teaspoon salt)",
      ingredients:
        "2 lbs chicken\n3 pieces dried bay leaves \n8 tablespoons soy sauce \n4 tablespoons white vinegar \n5 cloves garlic \n1 1/2 cups water\n3 tablespoons cooking oil\n1 teaspoon sugar \n1/4 teaspoon salt \n1 teaspoon whole peppercorn",
    },
    {
      name: "Special Chicken Curry",
      author_id: 1,
      author_name: "jiseeeh",
      image_link:
        "https://img.taste.com.au/6UjT2daC/taste/2021/03/vietnamese-chicken-curry-170428-1.jpg",
      description:
        "Heat oil in a pan. Fry potato for 1 minute per side. Remove from the pan. Set aside.Using the remaining oil, saute garlic, onion, celery, and ginger until onion softens.Add the chicken pieces. Saute until the outer part of the chicken turns light brown.Add 1 tablespoon fish sauce. Continue sautéing for 1 minute.Pour-in coconut milk and water. Let boil.Add curry powder. Stir until the powder is completely diluted. Cover the pot and continue cooking between low to medium heat until the liquid reduces to half.Add the red bell pepper and pan fried-potato. Cook for 5 minutes.Season with fish sauce and ground black pepper as needed. You can also add all-purpose cream if desired.Transfer to a serving bowl.",
      ingredients:
        "2 lbs. chicken cut into serving pieces\n1 tablespoon curry powder\n1 piece potato cubed\n4 cloves garlic minced\n2 stalks celery sliced\n1 piece red bell pepper sliced\n2 pieces long green pepper\n1 piece onion chopped\n2 thumbs ginger cut into strips\n2 cups coconut milk\n1/2 cup all-purpose cream optional\n1 cup water\nfish sauce \nground black pepper",
    },
  ];

  try {
    for (const recipe of recipes) {
      await pool.query(
        "INSERT INTO recipe (private_id,name,author_id,author_name,image_link,description,ingredients) VALUES (?,?,?,?,?,?,?)",
        [
          v4(),
          recipe.name,
          recipe.author_id,
          recipe.author_name,
          recipe.image_link,
          recipe.description,
          recipe.ingredients,
        ]
      );
    }

    res.status(200).json({ message: "Seeding success!" });
  } catch (error) {
    res.json({ message: "Something went wrong!" });
  }
});

module.exports = app;
