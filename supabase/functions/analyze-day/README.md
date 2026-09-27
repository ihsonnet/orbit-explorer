# Analyze Day edge function

This function keeps the OpenAI API key off the browser and returns a structured timeline for the **My Day & Space** page.

Configure and deploy it with the Supabase CLI:

```sh
supabase secrets set OPENAI_API_KEY=your_openai_api_key
supabase functions deploy analyze-day
```

For local Supabase development, add `OPENAI_API_KEY` to `supabase/.env.local` (do not commit it), then run:

```sh
supabase functions serve analyze-day --env-file supabase/.env.local
```

The function uses `gpt-4.1`, the Responses API, strict structured output, and `store: false`. Before high-traffic promotion, add production rate limiting or an abuse-control layer in front of the public function.
