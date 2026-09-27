const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
};

const analysisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: {
      type: 'string',
      description: 'A concise, friendly summary of how the described day intersects with space technology.',
    },
    steps: {
      type: 'array',
      minItems: 1,
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          time: {
            type: 'string',
            description: 'A time supplied by the user, or a broad label such as Morning or Later that does not invent precision.',
          },
          title: { type: 'string' },
          description: { type: 'string' },
          icon: {
            type: 'string',
            enum: [
              'weather',
              'navigation',
              'communication',
              'earth-observation',
              'timing',
              'emergency',
              'entertainment',
              'general',
            ],
          },
          satelliteTypes: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { type: 'string' },
          },
          explanation: { type: 'string' },
          examples: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { type: 'string' },
          },
        },
        required: [
          'time',
          'title',
          'description',
          'icon',
          'satelliteTypes',
          'explanation',
          'examples',
        ],
      },
    },
  },
  required: ['summary', 'steps'],
};

const instructions = `You are the science guide for S.P.A.C.E. for Everyone. Turn a visitor's description of their day into a clear, educational timeline showing credible connections to satellites and space technology.

Rules:
- Preserve the visitor's chronological order. Never invent an exact time; use broad labels such as Morning, Afternoon, Evening, or Later when needed.
- Include up to eight distinct activities that have a meaningful direct or indirect space connection.
- Be scientifically careful. Most video calls and streaming travel through terrestrial fiber or mobile networks; mention communication satellites only when they plausibly provide access, backhaul, broadcast, or rural/remote connectivity.
- Distinguish direct dependencies (such as GNSS positioning) from indirect support (such as satellite weather observations or precision timing).
- Do not invent personal details, locations, actions, or named satellite missions.
- Use well-established satellite or constellation examples relevant to the explanation.
- Keep titles short, descriptions friendly, and explanations understandable to a general audience.
- If the day contains few meaningful connections, say so honestly in the summary rather than forcing every activity into a satellite claim.`;

interface OpenAIResponse {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured.');
    return new Response(JSON.stringify({ error: 'AI analysis is not configured.' }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  let day = '';
  try {
    const body = await request.json();
    day = typeof body?.day === 'string' ? body.day.trim() : '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (day.length < 10 || day.length > 4000) {
    return new Response(JSON.stringify({ error: 'Day description must be between 10 and 4,000 characters.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        store: false,
        instructions,
        input: [
          {
            role: 'user',
            content: [{ type: 'input_text', text: day }],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'day_space_analysis',
            strict: true,
            schema: analysisSchema,
          },
        },
        max_output_tokens: 1800,
      }),
    });

    const responseData = (await openAIResponse.json()) as OpenAIResponse;

    if (!openAIResponse.ok) {
      console.error('OpenAI request failed:', responseData.error?.message ?? openAIResponse.statusText);
      return new Response(JSON.stringify({ error: 'AI analysis failed.' }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    const outputText = responseData.output
      ?.find((item) => item.type === 'message')
      ?.content?.find((item) => item.type === 'output_text')
      ?.text;

    if (!outputText) {
      console.error('OpenAI response did not include structured output.');
      return new Response(JSON.stringify({ error: 'AI analysis was incomplete.' }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    return new Response(outputText, { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error('analyze-day failed:', error);
    return new Response(JSON.stringify({ error: 'AI analysis is temporarily unavailable.' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
