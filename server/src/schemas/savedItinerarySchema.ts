export const createItinerarySchema = {
  body: {
    type: 'object',
    required: ['name', 'items'],
    properties: {
      name: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'address', 'latitude', 'longitude'],
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            description: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' }
          }
        }
      }
    }
  }
};

export const getItinerarySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  }
}; 