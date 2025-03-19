export const itinerarySchema = {
  body: {
    type: 'object',
    required: ['destination', 'startDate', 'endDate'],
    properties: {
      destination: { type: 'string' },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      budget: { type: 'number' },
      preferences: { 
        type: 'array',
        items: { type: 'string' },
        default: []
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        destination: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        budget: { type: 'number' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              day: { type: 'number' },
              date: { type: 'string' },
              activities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    time: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    location: { type: 'string' },
                    price: { type: 'number' },
                    currency: { type: 'string' },
                    bookingLink: { type: 'string' },
                    isPaid: { type: 'boolean' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 

export const saveItinerarySchema = {
  body: {
    type: 'object',
    required: ['itinerary'],
    properties: { itinerary: { type: 'object' } }
  }
};

export const getUserItinerariesSchema =  {
  response: {
    200: {
      type: 'object',
      properties: {
        itineraries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              destination: { type: 'string' },
              name: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              budget: { type: 'number' },
              items: { type: 'array' }
            }
          }
        }
      }
    }
  }
}