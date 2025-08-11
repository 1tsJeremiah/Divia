import { setDefaultModelProvider, OpenAIResponsesModel, setDefaultOpenAIClient } from '@openai/agents';
import OpenAI from 'openai';
setDefaultOpenAIClient(new OpenAI({ apiKey: process.env.OPENAI_API_KEY!, project: process.env.OPENAI_PROJECT }));
setDefaultModelProvider(new OpenAIResponsesModel({ model: process.env.OPENAI_MODEL || 'gpt-5' }));
