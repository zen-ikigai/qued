import { connectToDB } from '@/utils/database'
import { Task } from '@/models/task'
import { parse } from 'url'

/**
 * Fetches a specific task by its ID if the user is authorized.
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} params - Route parameters including the task ID.
 * @returns {Response} - The response object with status and headers set, indicating success or failure.
 */
export const GET = async (req, { params }) => {
  // Ensure the method is GET
  if (req.method !== 'GET') {
    console.error('Attempted to access GET route with method:', req.method)
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    })
  }

  try {
    // Parse the request URL to get user ID
    const parsedUrl = parse(req.url, true)
    const { userId } = parsedUrl.query

    // Establish database connection
    await connectToDB()

    // Fetch the task by ID and verify that the requesting user is the task creator
    const task = await Task.findById(params.id)
    if (!task || task.creator.toString() !== userId) {
      console.error(
        'Task not found or unauthorized access attempt by user:',
        userId,
      )
      return new Response(
        JSON.stringify({ error: 'Unauthorized access or task not found' }),
        { status: 403 },
      )
    }

    // Return the task details
    return new Response(JSON.stringify(task), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching task for task ID:', params.id, error)
    // Return a 500 Internal Server Error response
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to fetch task due to an internal error.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
