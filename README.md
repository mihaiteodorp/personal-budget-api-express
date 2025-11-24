# Personal Budget API

A beginner-friendly REST API built with Node.js and Express that manages budget envelopes using the envelope budgeting method.

## How to Run

1. Clone the repository:
   git clone https://github.com/YOUR_USERNAME/personal-budget-api.git

2. Install dependencies:
   npm install

3. Start the server:
   node server.js

The API will run at:
http://localhost:3000/

## Available Endpoints

### GET /
Landing page.

### POST /envelopes
Create a new envelope.
Body example:
{
  "title": "Groceries",
  "budget": 300
}

### GET /envelopes
Retrieve all envelopes.

### GET /envelopes/:id
Retrieve a specific envelope.

### PUT /envelopes/:id
Update (spend from or rename) an envelope.

### DELETE /envelopes/:id
Delete an envelope.

### POST /envelopes/transfer/:from/:to
Transfer money between envelopes.
Body example:
{
  "amount": 50
}

### POST /envelopes/distribute
Distribute one amount across multiple envelopes.
Body example:
{
  "amount": 300,
  "envelopeIds": [1, 2, 3]
}

