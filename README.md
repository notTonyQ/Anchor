# Anchor

A serverless long-term reminder application built with Cloudflare Workers, D1, and Resend.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Secrets**:
    You need to set your Resend API Key and Sender Email.
    ```bash
    npx wrangler secret put RESEND_API_KEY
    # Enter your key
    ```
    
    Update `wrangler.toml` with your `SENDER_EMAIL` (or use a secret for that too if you prefer).

3.  **Database Setup**:
    Create the D1 database:
    ```bash
    npx wrangler d1 create anchor-db
    ```
    
    Update `wrangler.toml` with the `database_id` output from the command above.
    
    Apply the schema:
    ```bash
    npx wrangler d1 execute anchor-db --local --file=./schema.sql # For local dev
    npx wrangler d1 execute anchor-db --remote --file=./schema.sql # For production
    ```

## Running Locally

```bash
npx wrangler dev
```
Open [http://localhost:8787](http://localhost:8787).

## Testing CRON

To test the scheduled task locally:
```bash
curl "http://localhost:8787/__scheduled?cron=0+9+*+*+*"
```
(Note: `wrangler dev` might expose a different URL for testing scheduled events, or you can use the `L` key in the interactive session).

## Deployment

```bash
npx wrangler deploy
```
