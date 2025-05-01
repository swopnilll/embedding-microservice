# AI Embedding Microservice

This is a microservice built with Node.js and Express for generating and storing OpenAI embeddings from project and task data. The service supports chunking text using LangChain, generates embeddings using OpenAI, and stores them into a pgvector-enabled Supabase PostgreSQL database.

## 🚀 Features

- [x] Text chunking using LangChain
- [x] Embedding generation via OpenAI API
- [x] Vector storage using Supabase PostgreSQL with pgvector
- [x] Error handling and logging
- [x] Scalable, modular service architecture
- [ ] (Planned) AWS SQS integration for async processing

## 📁 Folder Structure

```
/src
├── controllers/
│   └── embeddingController.ts
├── routes/
│   └── generateEmbeddingRouter.ts
├── services/
│   └── embeddingService.ts
├── utils/
│   ├── chunker.ts
│   └── logger.ts
├── consumers/
│   └── embeddingConsumer.ts
├── db/
│   └── supabaseService.ts
├── config/
│   └── index.ts
└── index.ts
```

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- OpenAI API
- LangChain for chunking
- Supabase PostgreSQL with pgvector
- AWS SQS (planned integration)

## 📦 Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/surazregmi/embedding-microservice.git
   cd embedding-microservice
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file and add:

   ```env
   OPENAI_API_KEY=your_openai_key
   EMBEDDING_MODEL=text-embedding-3-small
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_service_key
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## 📨 API Endpoint

### `POST /api/generate-embedding`

Generates embeddings from provided `taskid` and `projectId`.

#### Request Body

```json
{
  "taskid": 123,
  "projectId": 456
}
```

#### Response

```json
{
  "message": "Embedding successfully generated and stored.",
  "embeddingIds": [1, 2, 3]
}
```

#### Error Example

```json
{
  "error": "Both 'projectId' and 'ticketId' are required as numbers."
}
```

## 🔄 Future Scope

- ✅ Subscribe to AWS SQS for async embedding generation
- 🔄 Integrate with main project/ticket creation events
- 🔍 Implement vector similarity search endpoint
- 📊 Add monitoring and analytics

## 🧠 Context

This microservice is part of the **Cognify-Ops** AI-powered project management tool, which leverages embeddings to provide contextual query capabilities over project knowledge bases.

## 👨‍💻 Author

Suraj Kumar Regmi  
[link2surajregmi@gmail.com](mailto:link2surajregmi@gmail.com)
