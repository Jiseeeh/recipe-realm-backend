# recipe-realm-backend :fire:

## Routes :car:

### user POST

- `/api/user`
  - query
    - username : string
  - reponses
    - 201 = success
    - 500 = failed

### recipe GET

- `/api/recipe`
  - responses 
    - 200 = success, returns all recipes
    - 500 = failed
    
### recipe POST

- `/api/recipe`
  - query
    - recipeName
    - authorId
    - authorName
    - imageLink
    - recipeIngredients
    - recipeDescription
  - responses
    - 201 = success
    - 500 = failed

### single recipe GET

- `/api/recipe/:id`
  - responses
    - 200 = success
    - 500 = failed

### single recipe PATCH

- `/api/recipe/:id`
  - query
    - recipeName 
    - imageLink
    - recipeIngredients
    - recipeDescription
  - responses
    - 200 = success
    - 500 = failed
    
### single recipe DELETE

- `/api/recipe/:id`
  - responses
    - 200 = success
    - 500 = failed
