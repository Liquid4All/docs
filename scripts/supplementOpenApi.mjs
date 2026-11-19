import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const string = (description) => ({ type: 'string', ...(description ? { description } : {}) });
const object = (properties, required = []) => ({ type: 'object', properties, ...(required.length ? { required } : {}) });
const array = (items) => ({ type: 'array', items });
const enumeration = (...values) => ({ type: 'string', enum: values });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const probability = { type: 'number', minimum: 0, maximum: 1 };
const nullable = (schema) => ({ anyOf: [schema, { type: 'null' }] });
const structured = { anyOf: [{ type: 'string' }, { type: 'object', additionalProperties: true }, { type: 'array', items: {} }] };
const dictionary = (schema) => ({ type: 'object', additionalProperties: schema });
const pair = (items) => ({ type: 'array', items, minItems: 2, maxItems: 2 });
const textPart = object({ type: { const: 'text' }, text: string() }, ['type', 'text']);
const imagePart = object({ type: { const: 'image_url' }, image_url: object({ url: string('Public HTTP(S) image URL or base64 image data URL.'), detail: enumeration('auto', 'low', 'high') }, ['url']) }, ['type', 'image_url']);
const audioPart = object({ type: { const: 'input_audio' }, input_audio: object({ data: string('Base64 WAV bytes, without a data URL prefix.'), format: { const: 'wav', type: 'string' } }, ['data', 'format']) }, ['type', 'input_audio']);
const functionCall = object({ name: string(), arguments: string('JSON-encoded function arguments.') }, ['name', 'arguments']);
const toolCall = object({ id: string(), type: { const: 'function', type: 'string' }, function: functionCall }, ['id', 'type', 'function']);
const toolDefinition = object({ type: { const: 'function', type: 'string' }, function: object({ name: string(), description: string(), parameters: { type: 'object', additionalProperties: true, description: 'JSON Schema for function arguments.' }, strict: { type: 'boolean' } }, ['name']) }, ['type', 'function']);
const replyAudio = object({ id: string(), data: string('Base64 audio bytes.'), transcript: string(), expires_at: { type: 'integer' } });
const replyMessage = object({ role: { const: 'assistant' }, content: nullable(string()), reasoning: nullable(string('Reasoning text when returned by the model/parser.')), reasoning_content: nullable(string('Provider-compatible reasoning field, when returned.')), tool_calls: array(ref('FunctionToolCall')), audio: ref('ReplyAudio') }, ['role']);
const span = pair({ type: 'integer', minimum: 0 });
const read = { text: nullable(string()), span: nullable(span), found: probability, path: string('JSON Pointer for a span in a JSON state, when provided.') };
const edges = object({ top: probability, bottom: probability, left: probability, right: probability }, ['top', 'bottom', 'left', 'right']);
const counted = { count: { type: 'integer', minimum: 0 }, at_least: { type: 'boolean' }, presence: array(probability) };
const question = (type, fields = {}, required = []) => object({ type: { const: type, type: 'string' }, instructions: structured, ...fields }, ['type', 'instructions', ...required]);
const answer = (type, fields) => object({ type: { const: type, type: 'string' }, ...fields }, ['type', ...Object.keys(fields).filter((name) => name !== 'path')]);

export function supplement(spec) {
  spec.components.schemas ??= {};
  Object.assign(spec.components.schemas, {
    FunctionToolCall: toolCall,
    FunctionTool: toolDefinition,
    ChatMessage: {
      oneOf: [
        object({ role: enumeration('system', 'developer'), content: { anyOf: [string(), array(textPart)] }, name: string() }, ['role', 'content']),
        object({ role: { const: 'user', type: 'string' }, content: { anyOf: [string(), array({ oneOf: [textPart, imagePart, audioPart] })] }, name: string() }, ['role', 'content']),
        { ...object({ role: { const: 'assistant', type: 'string' }, content: nullable({ anyOf: [string(), array(textPart)] }), reasoning: nullable(string()), reasoning_content: nullable(string()), tool_calls: array(ref('FunctionToolCall')), name: string() }, ['role']), anyOf: [{ required: ['content'] }, { required: ['tool_calls'] }] },
        object({ role: { const: 'tool', type: 'string' }, content: { anyOf: [string(), array({ oneOf: [textPart, imagePart] })] }, tool_call_id: string() }, ['role', 'content', 'tool_call_id']),
      ],
      description: 'Role-specific OpenAI-compatible messages. Tool results must use the corresponding tool_call_id. Preserve returned reasoning with an assistant tool-call turn when the model requires it. Earlier spoken replies must be sent as their transcript in content; audio.id alone is not supported.',
    },
    ReplyAudio: replyAudio,
    DecisionQuestion: {
      oneOf: [
        question('noul', { criteria: nullable(object({ true: structured, false: structured })) }),
        question('choice', { multiple: { type: 'boolean', default: false }, criteria: { ...dictionary(nullable(structured)), minProperties: 2, maxProperties: 255 } }, ['criteria']),
        question('score', { criteria: { ...array(structured), minItems: 2, maxItems: 10 } }, ['criteria']),
        question('text'), question('date'),
        question('number', { unit: string(), range: { ...pair({ type: 'number' }), description: 'Ascending [low, high] interval for estimation. Without range, read a number from the state.' }, step: { type: 'number', exclusiveMinimum: 0, description: 'Requires range and must divide it into equal parts.' } }),
        question('box'),
        question('boxes', { max: { type: 'integer', minimum: 1, maximum: 64 } }),
        question('spans', { max: { type: 'integer', minimum: 1, maximum: 64 } }),
      ],
      description: 'Named typed question. box and boxes require exactly one image. Instructions are written text or JSON; send audio clips in the request audio array, not as spoken instructions.',
    },
    DecisionAnswer: {
      oneOf: [
        answer('noul', { noul: probability }),
        answer('choice', { choice: string(), probabilities: dictionary(probability), confidence: probability }),
        answer('choice', { choices: array(string()), probabilities: dictionary(probability) }),
        answer('score', { score: { type: 'number' }, legend: dictionary(string()), probabilities: dictionary(probability), confidence: probability }),
        answer('text', read),
        answer('date', { date: nullable(string()), ...read }),
        answer('number', { number: nullable({ type: 'number' }), unit: nullable(string()), ...read }),
        answer('number', { number: { type: 'number' }, interval: pair({ type: 'number' }), unit: nullable(string()) }),
        answer('box', { box: nullable(edges), found: probability, confidence: probability }),
        answer('boxes', { boxes: array(object({ box: edges, found: probability, confidence: probability }, ['box', 'found', 'confidence'])), ...counted }),
        answer('spans', { spans: array(object(read, ['text', 'span', 'found'])), ...counted }),
      ],
      description: 'An answer for the question under the same key. Read values are null when found < 0.5. Spans are [start, end) Unicode code-point offsets into the state (JSON states use two-space indentation). Box edges are fractions of the image. Estimate interval is [p10, p90].',
    },
    ApiError: object({ error: object({ message: string(), type: string(), param: nullable(string()), code: nullable(string()) }, ['message', 'type', 'param', 'code']) }, ['error']),
  });
  const chat = spec.paths['/openai/v1/chat/completions'].post;
  const body = chat.requestBody.content['application/json'].schema;
  body.properties.messages.items = ref('ChatMessage');
  body.properties.messages.minItems = 1;
  body.properties.modalities.items = enumeration('text', 'audio');
  body.properties.audio.properties = { format: enumeration('pcm16', 'wav'), voice: { anyOf: [string(), object({ id: string() }, ['id'])], description: 'Accepted for compatibility; does not change the voice.' } };
  Object.assign(body.properties, {
    temperature: { type: 'number', description: 'Sampling temperature; supported values depend on the model.' },
    top_p: { type: 'number', description: 'Nucleus sampling probability.' },
    top_k: { type: 'integer', description: 'Top-k sampling, when supported by the model.' },
    repetition_penalty: { type: 'number' },
    max_tokens: { type: 'integer', minimum: 1, description: 'Maximum generated tokens, including reasoning. Leave enough room for a final answer.' },
    max_completion_tokens: { type: 'integer', minimum: 1, description: 'OpenAI-compatible output budget; model support may vary. Use one output-budget field per request.' },
    stop: { anyOf: [string(), array(string())] },
    tools: array(ref('FunctionTool')),
    tool_choice: { anyOf: [enumeration('none', 'auto', 'required'), object({ type: { const: 'function' }, function: object({ name: string() }, ['name']) }, ['type', 'function'])] },
    response_format: { oneOf: [object({ type: { const: 'text' } }, ['type']), object({ type: { const: 'json_object' } }, ['type']), object({ type: { const: 'json_schema' }, json_schema: object({ name: string(), description: string(), schema: { type: 'object', additionalProperties: true }, strict: { type: 'boolean' } }, ['name', 'schema']) }, ['type', 'json_schema'])], description: 'Structured output format, where supported by the selected model.' },
    stream_options: object({ include_usage: { type: 'boolean' } }),
    user: string('Optional caller identifier.'),
  });
  const choice = object({ index: { type: 'integer' }, message: replyMessage, finish_reason: nullable(string()) }, ['index', 'message', 'finish_reason']);
  chat.responses['200'].content['application/json'].schema.properties.choices.items = choice;
  chat.responses['200'].content['text/event-stream'] = {
    schema: { type: 'string', description: 'Server-sent events when stream=true. Each data event is a chat.completion.chunk with choices[].delta (content, reasoning, tool_calls, or audio) and finish_reason. A usage chunk may have an empty choices array. The stream ends with data: [DONE].' },
    example: 'data: {"object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}\n\ndata: [DONE]\n\n',
  };
  chat.description = 'Generate a model response for a chat conversation. See [Text generation](https://docs.liquid.ai/api/guides/text-generation). Sampling, tool calling, reasoning, and structured output support depend on the selected model. With stream=true the response is text/event-stream, rather than a JSON completion.';

  const decisions = spec.paths['/decisions/v1/systemone'].post;
  const decisionBody = decisions.requestBody.content['application/json'].schema;
  decisionBody.properties.model.description = 'A decision model id from GET /decisions/v1/models, such as d1.2 or d1.2-ultra. Use the exact id returned for your organization.';
  decisionBody.properties.questions = { ...dictionary(ref('DecisionQuestion')), minProperties: 1, maxProperties: 128, description: 'Up to 128 named questions. Each question reads the state and media. d1.2 and d1.2-ultra allow 65,536 input tokens per question and 250,000 bytes of text; the entire request must fit the 4.5 MiB body limit.' };
  const media = (types) => ({ oneOf: [string('Base64 data URL with a matching media content type.'), object({ content_type: enumeration(...types), base64: string('Base64-encoded file bytes.') }, ['content_type', 'base64'])] });
  decisionBody.properties.images.items = media(['image/jpeg', 'image/png', 'image/webp']);
  decisionBody.properties.images.maxItems = 8;
  decisionBody.properties.images.description = 'Up to 8 JPEG, PNG, or WebP images as base64 data URLs or {content_type, base64} objects. Remote URLs are not accepted. Each image is at most 5 MiB, subject to the smaller 4.5 MiB whole-request limit. box and boxes require exactly one image. Check input_modalities in GET /decisions/v1/models for model support.';
  decisionBody.properties.audio = { ...array(media(['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/ogg'])), maxItems: 8, description: 'Up to 8 WAV, MP3, FLAC, or OGG clips, at most 300 seconds combined, subject to the whole-request body limit. The declared content type must match the bytes. Check input_modalities for model support. Video is not accepted.' };
  const decisionReply = decisions.responses['200'].content['application/json'].schema;
  decisionReply.properties.answers = { ...dictionary(ref('DecisionAnswer')), description: 'One typed answer per question id, under the same keys.' };
  decisions.description = 'Answer named typed questions about text, JSON, images, or audio. Supports noul, choice (including multiple=true), score, text, date, number, box, boxes, and spans. See [Decisions](https://docs.liquid.ai/api/guides/decisions) for examples. The hosted endpoint does not accept video or spoken question instructions; open-weight model APIs have different input shapes.';
  for (const [operation, statuses] of [[chat, ['400','401','402','403','404','413','422','502','503','504']], [decisions, ['400','401','402','403','404','413','422','502','503','504']]]) {
    const descriptions = { 400: 'Invalid request or unsupported modality.', 401: 'Missing or invalid API key.', 402: 'Insufficient credit.', 403: 'Access denied.', 404: 'Unknown or unavailable model id.', 413: 'Request body exceeds the endpoint limit.', 422: 'Request validation failed or the model input limit was exceeded.', 502: 'Inference backend failed.', 503: 'Model temporarily unavailable.', 504: 'Inference deadline exceeded.' };
    for (const status of statuses) operation.responses[status] = { description: descriptions[status], content: { 'application/json': { schema: ref('ApiError') } } };
    operation.responses['429'].content['application/json'].schema = ref('ApiError');
  }
  const jsonReply = (operation) => operation.responses['200'].content['application/json'].schema;
  const model = object({ id: string(), object: { const: 'model' }, created: { type: 'integer' }, owned_by: string() }, ['id', 'object', 'created', 'owned_by']);
  spec.components.schemas.Model = model;
  jsonReply(spec.paths['/openai/v1/models'].get).properties.data.items = ref('Model');
  spec.paths['/openai/v1/models/{model}'].get.responses['200'].content['application/json'].schema = ref('Model');
  const decisionModel = object({ name: string('Model id to pass in the request.'), description: string(), release_date: { type: 'string', format: 'date' }, input_modalities: array(enumeration('text', 'image', 'audio')) }, ['name','description','release_date','input_modalities']);
  spec.components.schemas.DecisionModel = decisionModel;
  const decisionModels = spec.paths['/decisions/v1/models'].get;
  jsonReply(decisionModels).properties.models.items = ref('DecisionModel');
  jsonReply(decisionModels).properties.models.description = 'Decision models available to your organization, including accepted input modalities. Current d1.2 models accept text, images, and audio.';
  const decisionExample = decisionModels.responses['200'].content['application/json'].example;
  if (decisionExample?.models) decisionExample.models = [{ name: 'd1.2', description: 'Typed decisions over text, images, and audio.', release_date: decisionExample.models[0]?.release_date ?? '2026-01-01', input_modalities: ['text','image','audio'] }];
  const fileSchema = structuredClone(spec.components.schemas.File ?? jsonReply(spec.paths['/openai/v1/files/{id}'].get));
  fileSchema.properties.expires_at = { type: 'integer', description: 'Unix expiry timestamp, when an expiry is set.' };
  spec.components.schemas.File = fileSchema;
  spec.paths['/openai/v1/files/{id}'].get.responses['200'].content['application/json'].schema = ref('File');
  jsonReply(spec.paths['/openai/v1/files'].get).properties.data.items = ref('File');
  const batch = structuredClone(spec.components.schemas.Batch ?? jsonReply(spec.paths['/openai/v1/batches'].post));
  for (const field of ['created_at','in_progress_at','finalizing_at','completed_at','failed_at','expires_at','cancelled_at']) batch.properties[field] = { type: 'integer', description: 'Unix timestamp in seconds; optional until the corresponding event occurs.' };
  batch.properties.request_counts = object({ total: { type: 'integer' }, completed: { type: 'integer' }, failed: { type: 'integer' } }, ['total','completed','failed']);
  batch.properties.errors = object({ object: { const: 'list' }, data: array(object({ code: string(), message: string(), param: nullable(string()), line: { type: 'integer' } })) });
  batch.properties.metadata = dictionary(string());
  spec.components.schemas.Batch = batch;
  for (const [route, method] of [['/openai/v1/batches','post'],['/openai/v1/batches/{id}','get'],['/openai/v1/batches/{id}/cancel','post']]) spec.paths[route][method].responses['200'].content['application/json'].schema = ref('Batch');
  jsonReply(spec.paths['/openai/v1/batches'].get).properties.data.items = ref('Batch');
  const content = spec.paths['/openai/v1/files/{id}/content'].get;
  delete content.responses['200'];
  content.responses['302'] = { description: 'Redirect to a short-lived presigned download URL. Use curl -L to retrieve the file bytes.', headers: { Location: { required: true, schema: { type: 'string', format: 'uri' }, description: 'Presigned file download URL.' } } };
  spec.paths['/openai/v1/files'].get.description = 'List all files for the organization in descending creation order. Pagination parameters are not supported.';
  for (const operations of Object.values(spec.paths)) {
    for (const operation of Object.values(operations)) {
      for (const sample of operation['x-codeSamples'] ?? []) {
        sample.source = sample.source.replace(/\$DECISION_MODEL_ID/g, 'd1.2').replace(/\$MODEL_ID/g, 'lfm3-1.7b');
      }
    }
  }
  spec.info.description = spec.info.description.replace(/\*\*Decision models\*\*[\s\S]*$/, '**Decision models** — `POST /decisions/v1/systemone` answers typed questions using models such as `d1.2` and `d1.2-ultra`.');
  function fillModelExamples(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === 'string') value[key] = child.replaceAll('$DECISION_MODEL_ID', 'd1.2').replaceAll('$MODEL_ID', 'lfm3-1.7b');
      else fillModelExamples(child);
    }
  }
  fillModelExamples(spec);
  return spec;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] ?? 'api/openapi.json';
  const spec = supplement(JSON.parse(fs.readFileSync(file, 'utf8')));
  fs.writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`);
  console.log(`Updated endpoint documentation in ${file}`);
}
