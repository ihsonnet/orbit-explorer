# My Day & Space Netlify Function

The `analyze-day` function reads `OPENAI_API_KEY` from the Netlify runtime environment and keeps it out of browser code.

## Netlify production setup

1. Open the site in Netlify.
2. Go to **Project configuration → Environment variables**.
3. Create `OPENAI_API_KEY` and paste the OpenAI API key as its value.
4. If scopes are available on the plan, include **Functions** (or choose all scopes).
5. Trigger a new deployment so the function uses the variable.

Do not prefix the variable with `VITE_`; Vite-prefixed variables can be bundled into client-side code.

## Local development

Create an uncommitted `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
```

Then run the project through Netlify Dev so both Vite and the function are available:

```sh
npx netlify dev
```

The frontend sends requests to `/.netlify/functions/analyze-day` on the same site.
