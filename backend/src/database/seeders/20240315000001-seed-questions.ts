import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('questions', [
      {
        title: 'How satisfied are you with our service?',
        description: 'Please rate your overall satisfaction with our service.',
        type: 'rating',
        options: JSON.stringify({
          min: 1,
          max: 5,
          labels: {
            1: 'Very Dissatisfied',
            5: 'Very Satisfied'
          }
        }),
        required: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'What aspects of our service could be improved?',
        description: 'Please select all areas that need improvement.',
        type: 'checkbox',
        options: JSON.stringify({
          choices: [
            'Customer Support',
            'Product Quality',
            'Pricing',
            'Website Experience',
            'Delivery Speed'
          ]
        }),
        required: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'How did you hear about us?',
        description: 'Please select the most relevant option.',
        type: 'radio',
        options: JSON.stringify({
          choices: [
            'Social Media',
            'Friend/Family',
            'Search Engine',
            'Advertisement',
            'Other'
          ]
        }),
        required: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Additional Comments',
        description: 'Please share any additional feedback you have.',
        type: 'text',
        options: JSON.stringify({
          multiline: true,
          maxLength: 500
        }),
        required: false,
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('questions', {}, {});
  }
}; 