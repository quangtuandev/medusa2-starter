import { json, type ActionFunction } from 'react-router';
import { z } from 'zod';

const CreateReviewSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be 1000 characters or less'),
  stars: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();

    const data = {
      product_id: formData.get('product_id'),
      name: formData.get('name'),
      content: formData.get('content'),
      stars: formData.get('stars') ? parseInt(formData.get('stars') as string) : undefined,
    };

    // Validate input
    const validationResult = CreateReviewSchema.safeParse(data);

    if (!validationResult.success) {
      return json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validated = validationResult.data as CreateReviewInput;

    // Get backend URL from environment
    const backendUrl = process.env.INTERNAL_MEDUSA_API_URL || 'http://localhost:9000';

    // Submit to Medusa backend
    const response = await fetch(`${backendUrl}/store/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return json(
        {
          success: false,
          error: error.message || 'Failed to create review',
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return json(
      {
        success: true,
        review: result.review,
        message: result.message || 'Review submitted successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating review:', error);
    return json(
      {
        success: false,
        error: error.message || 'An error occurred',
      },
      { status: 500 }
    );
  }
};
