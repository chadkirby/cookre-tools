---
name: cookre-recipes
description: Search, read, add and edit the cook's recipes in Cook:RE. Use when the cook mentions their recipes, their library, a dish they have saved, wants a recipe added to Cook:RE, or wants one changed, scaled, substituted, or organized into collections.
---

# Working with a Cook:RE library

Cook:RE holds the cook's saved recipes as structured ingredients and steps. You reach them through
the `cookre` tools. They can search, read, add and edit recipes and organize collections. They
cannot import from a link or photo, or delete a recipe.

## Find, read, then edit

1. **Search first.** When the cook names a dish, call `search_recipes` with a few of its words
   before asking which recipe they mean. Ask only if several results fit and you can't tell which
   is meant, and offer those titles. Omit the query to list recently edited recipes.
2. **Read before you edit.** Call `get_recipe` for the recipe. It returns the ingredient lines as
   `L1…`, the steps as `S1…`, and a `baseRev` and `snapshot`.
3. **Edit with `edit_recipe`.** Pass the `recipeId`, `baseRev` and `snapshot` exactly as
   `get_recipe` gave them, a one-sentence `summary` the cook will read, and the operations. Name
   lines and steps by their L and S handles, never by position or text. Operations apply in order.
4. **Resolve a new ingredient.** For an ingredient you add or replace, call `search_substances` and
   pass the best match as `substanceID`. Omit it if nothing fits.
5. **If the edit is refused** because the recipe changed or an operation didn't apply, the result
   says why. Read the recipe again and retry once. If it still fails, tell the cook what the
   result said.

## Add a recipe

When the cook asks you to add or save a recipe to Cook:RE (one they paste or dictate, or one you
worked out together), call `create_recipe` with the whole recipe as plain text: the title, the
ingredient list one line per ingredient with its amount, then the steps. Pass `title` only if the
text has none, and `context` for where it came from, such as a book or a relative's card.

- Cook:RE reads the text the way the app reads a pasted recipe and adds it at once. Don't ask
  "are you sure?" first. Tell the cook it was added, and that they can delete it in the app.
- Call it **once per recipe**: calling again adds a second copy. If the cook may already have it,
  search first. To change a recipe that's already there, use `edit_recipe`.
- The result includes the new recipe's `recipeId`, `baseRev`, `snapshot` and handles, so you can
  follow up with `edit_recipe` directly. If it lists import notes, mention them briefly.
- If the text holds several recipes, only the first is added. Add each one in its own call.

## How the recipe model works

- The **ingredient list is the authority.** Steps refer to it. Change an ingredient and the steps
  that mention it follow, so don't rewrite a step only to repeat a changed amount.
- Give amounts the way a cookbook prints them in `printedText`, and set `basis`, `amount` and
  `unit` to match. Ounces, pounds and grams are weight; fluid ounces and cups are volume.
- **Scaling** a recipe is a view in the app, not an edit. If the cook wants a halved or doubled
  recipe *saved*, edit each amount. If they only want to know the quantities, calculate and tell
  them, without editing.

## Edits are safe

Every edit is saved at once as one revision that the cook can undo in the app's History, named
for your assistant. So don't ask "are you sure?" before an ordinary edit. Do the edit, then say
plainly what changed. Ask first only when the request is ambiguous about *what* to change.

## Collections

A collection is a named group of recipes. `list_collections` shows them, and `search_recipes` with
`collection` lists one (or `"none"`). To change them, call `preview_collection_changes`, show the
cook exactly what it returns, and call `apply_collection_changes` only after they agree in the
conversation. Deleting a collection never deletes its recipes.

## What Cook:RE can't do

It can't import a recipe from a link or a photo, or delete one. Say so and point the cook to the
Cook:RE app (importing is done by sharing a recipe into the app). Don't improvise by overwriting an
unrelated recipe.

## More

Guides for the cook, which you can link: https://www.cookre.app/docs (scaling and editing:
https://www.cookre.app/docs/scaling-and-editing, connecting an assistant:
https://www.cookre.app/docs/assistant-setup).
