# Family Travel Tracker

A web application that allows families to track countries they've visited together. Built with Node.js, Express, and PostgreSQL.

## Features

- Track visited countries for multiple family members
- Real-time updates using Server-Sent Events (SSE)
- Interactive world map visualization
- Color-coded tracking per family member
- PostgreSQL database for data persistence

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- EJS templating
- Server-Sent Events (SSE)
- HTML/CSS

## Setup

1. Clone the repository:
```bash
git clone https://github.com/amirhosseinzakeri715/Family-tracker.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
- Create a database named 'world'
- Run the setup SQL scripts

4. Start the server:
```bash
node index.js
```

5. Visit `http://localhost:3000` in your browser

## Database Setup

The application requires a PostgreSQL database with the following tables:
- countries
- users
- visited_countries

## Environment Variables

Create a `.env` file with: 
