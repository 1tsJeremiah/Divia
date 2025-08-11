# GPT Actions setup for Divia

1. Deploy the HTTP API (see `server.js`) and make sure it is accessible over HTTPS.
2. Host `openapi/divia.yaml` at a public URL.
3. In ChatGPT:
   - Settings → **Actions** → *Add Action*.
   - Provide the URL to the hosted OpenAPI spec.
   - For authentication choose **API Key** and set the header `X-API-Key` with your key.
4. Test the action by asking for a tarot reading.

## Production notes

- Set reasonable timeouts; the API should respond within 10s.
- Handle `429` and `5xx` responses with retries/backoff.
- Paginate long results if you add more endpoints in the future.
