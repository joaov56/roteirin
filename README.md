# Roteirin - AI Travel Itinerary Generator

Roteirin is a full-stack application that generates personalized travel itineraries using AI. Users can input their destination, travel dates, and budget, and the application will create a detailed day-by-day itinerary with activities, prices, and booking links.

## Features

- Generate detailed travel itineraries based on destination and dates
- Customize itineraries based on budget and preferences
- Regenerate individual activities if you don't like them
- View pricing information and booking links for paid activities
- Responsive design for both desktop and mobile

## Tech Stack

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Fastify
- TypeScript
- OpenAI API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/roteirin.git
   cd roteirin
   ```

2. Install dependencies for both client and server:

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the server directory based on `.env.example`
   - Add your OpenAI API key to the `.env` file

4. Start the development servers:

   ```bash
   # Start the backend server
   cd server
   npm run dev

   # In a new terminal, start the frontend
   cd client
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
roteirin/
├── client/                # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── services/      # API services
│   └── public/            # Static assets
└── server/                # Fastify backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── routes/        # API routes
    │   ├── schemas/       # Validation schemas
    │   └── services/      # Business logic
    └── .env.example       # Example environment variables
```

## Future Improvements

- Add user authentication
- Save itineraries to a database
- Add more customization options
- Implement social sharing features
- Add multi-language support

## License

MIT
