---
name: cookre-recipes
description: Search, read and edit the cook's recipes in Cook:RE. Use when the cook mentions their recipes, their library, a dish they have saved, or wants a recipe changed, scaled, substituted, or organized into collections.
---

# Working with a Cook:RE library

Cook:RE holds the cook's saved recipes as structured ingredients and steps. You reach them through
the `cookre` tools. They can search, read and edit recipes and organize collections. They cannot
import, create or delete a recipe.

## Find, read, then edit

1. **Search first.** When the cook names a dish, call `search_recipes` with a few of its words
   before asking which recipe they mean. Ask only if several results fit and you can't tell which
   is meant, and offer those titles. Omit the query to list recently edited recipes.
2. **Read before you edit.** Call `get_recipe` for the recipe. It returns the ingredient lines as
   `L1…`, the steps as `S1…`, and a `baseRev` and `snapshot`.
3. **Edit with `propose_edit`.** Pass the `recipeId`, `baseRev` and `snapshot` exactly as
   `get_recipe` gave them, a one-sentence `summary` the cook will read, and the operations. Name
   lines and steps by their L and S handles, never by position or text. Operations apply in order.
4. **Resolve a new ingredient.** For an ingredient you add or replace, call `search_substances` and
   pass the best match as `substanceID`. Omit it if nothing fits.
5. **If the edit is refused** because the recipe changed or an operation didn't apply, the result
   says why. Read the recipe again and retry once. If it still fails, tell the cook what the
   result said.

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

It can't import a recipe, create one, or delete one. Say so and point the cook to the Cook:RE app
(importing is done by sharing a recipe into the app). Don't improvise by overwriting an unrelated
recipe. You may help the cook write a recipe out in the chat, but it won't be in their library.

## More

Guides for the cook, which you can link: https://www.cookre.app/docs (scaling and editing:
https://www.cookre.app/docs/scaling-and-editing, connecting an assistant:
https://www.cookre.app/docs/assistant-setup).
