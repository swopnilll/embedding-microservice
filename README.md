# AI Embedding Microservice

This is a microservice built with Node.js and Express for generating and storing OpenAI embeddings from project and task data. The service supports chunking text using LangChain, generates embeddings using OpenAI, and stores them into a pgvector-enabled Supabase PostgreSQL database.

## 🚀 Features

- [x] Text chunking using LangChain
- [x] Embedding generation via OpenAI API
- [x] Vector storage using Supabase PostgreSQL with pgvector
- [x] Error handling and logging
- [x] Scalable, modular service architecture
- [x] Azure Service Bus

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
- Azure Service Bus

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

## 🧠 Context

This microservice is part of the **Cognify-Ops** AI-powered project management tool, which leverages embeddings to provide contextual query capabilities over project knowledge bases.

## 👨‍💻 Authors
- Suraj Kumar Regmi [link2surajregmi@gmail.com](mailto:link2surajregmi@gmail.com)
- Swopnil Acharya [swopnilacharya@gmail.com](mailto:swopnilacharya@gmail.com)

## 🔴 Major Issues in Current Embedding Pipeline

### 1\. **No Evaluation System (Quality Control Missing)**

-   No automated tests to validate embeddings’ correctness.
-   No ground-truth evaluation to measure **retrieval accuracy**.
-   No scoring mechanism for **relevance of retrieved chunks**.
-   No regression testing – cannot detect when a new chunking/embedding strategy **degrades performance**.
-   No benchmark dataset for comparing **different embedding models**.
* * *

### 2\. **No AI Observability (Lack of Transparency)**

-   No logging of:
    -   How content was chunked (start/end indices, overlaps).
    -   Embedding generation metadata (token count, text length, embedding model used).
    -   Cost per embedding call (tokens × rate).
    -   Latency of embedding pipeline.
    -   Failure cases (timeouts, retries, truncations).
-   No monitoring of vector DB queries (retrieval similarity scores, ranking correctness).
-   No visualization of embedding pipeline performance (dashboards/alerts).
* * *

### 3\. **Scalability & Fault Tolerance Issues**

-   Pipeline works only for **small inputs** (few lines of content).
-   For medium/large documents:
    -   Tokenization often exceeds model limits.
    -   No fallback strategy (e.g., adaptive chunking, summarization before embedding).
    -   No streaming or incremental embedding updates → blocks entire pipeline.
-   No retry/backoff mechanism for failed embeddings.
* * *

### 4\. **Chunking Problems**

-   Current chunking logic doesn’t adapt to **different content structures** (code, long paragraphs, tables).
-   No logging of chunk boundaries → cannot debug poor retrieval results.
-   No semantic validation (chunk may cut mid-sentence or mid-code-block, harming retrieval quality).
-   No experiments with different chunk sizes / overlaps.
* * *

### 5\. **Data Integrity & Sync Gaps**

-   No versioning of embeddings → can’t track which text corresponds to which embedding.
-   No automated check to ensure **every document has an embedding** (risk of missing chunks).
-   No mechanism to re-embed content when:
    -   Source content changes
    -   Better embedding model becomes available
-   Risk of **stale or missing vectors** in database.
* * *

### 6\. **Lack of Feedback Loop**

-   No user feedback collection on whether retrieved answers were **useful or hallucinated**.
-   No way to tie feedback back into pipeline for retraining or re-embedding.
-   No “human-in-the-loop” checkpoints for critical responses.
* * *

### 7\. **Operational Blind Spots**

-   No visibility into **token usage and cost breakdown** at scale.
-   No alerting for anomalies (e.g., sudden spike in cost, retrieval similarity dropping).
-   No traceability: can’t answer “why did the AI generate this response?”
-   Hard to debug when the system fails (is it chunking? embedding? vector DB search? LLM hallucination?).
* * *

✅ In short:

-   Right now, the pipeline is a **black box** → works for trivial cases but fails for real-world scale.
-   Without eval + observability, **you cannot measure, improve, or trust** the system.




## Monitoring 
### 🔹 a) What to Monitor

1.  **User Prompts** – What users are asking about Jira tasks / legacy documentation.
2.  **Retrieved Chunks (RAG)** – Which vector embeddings are selected, their similarity scores.
3.  **LLM Responses** – Output text, confidence, potential hallucinations.
4.  **Latency & Cost** – How long queries take, how many tokens consumed, cost per request.
5.  **Feedback Loop** – Whether users found the answer helpful (thumbs up/down).
* * *

### 🔹 b) How to Analyze

-   **Accuracy Analysis**: Track how often retrieved chunks are actually relevant.
-   **Drift Detection**: If tasks/documents change but embeddings aren’t updated, catch mismatch.
-   **Failure Patterns**: When the model hallucinates or gives incomplete answers.
-   **Usage Insights**: Which parts of knowledge base are queried the most (helps you prioritize docs to improve).
* * *

### 🔹 c) How to Visualize (Implementation Ideas)

-   **Dashboards (Grafana/Prometheus + Supabase metrics)**
    -   Requests per user/project
    -   Top queried tasks
    -   Avg. retrieval similarity score
    -   LLM response length, cost, latency
-   **Error/Drift Detection Alerts**
    -   Example: “Embedding out-of-sync with DB for project X”
    -   Example: “Retrieval similarity below threshold on >30% of queries this week”
* * *

### 🔹 d) Technical Implementation for _Cognify Ops_

1.  **Logging Layer**
    -   Store every query, retrieved context, similarity score, and final answer in PostgreSQL (extra `observability_logs` table).
    -   Include metadata: latency, token usage, cost, user\_id, project\_id.
2.  **Metrics Collection**
    -   Use **OpenTelemetry** or **LangSmith (LangChain)** for tracing prompt → retrieval → LLM response.
    -   Expose metrics via Prometheus exporter.
3.  **Visualization**
    -   Connect metrics to Grafana for dashboards.
    -   Alternatively, build an **internal Cognify Ops “Observability Dashboard”** → helps devs see which knowledge areas are weak.
4.  **Feedback Loop**
    -   Add a simple thumbs up/down after every LLM response.
    -   Store results to retrain embeddings or adjust chunking strategy.

