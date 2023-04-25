# recipe-realm-backend :fire:

## Routes :car:

### user POST

- `/api/user`
  - body
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
  - body
    - recipeName : string
    - authorId : int
    - authorName: string
    - imageLink : string
    - recipeIngredients : string
    - recipeDescription : string
  - responses
    - 201 = success
    - 500 = failed

### single recipe GET

- `/api/recipe/:id`
  - body
    - id
  - responses
    - 200 = success
    - 500 = failed

### single recipe PATCH

- `/api/recipe/:id`
  - body
    - recipeName : string
    - imageLink : string
    - recipeIngredients : string
    - recipeDescription : string
  - responses
    - 200 = success
    - 500 = failed
    
### single recipe DELETE

- `/api/recipe/:id`
  - responses
    - 200 = success
    - 500 = failed
