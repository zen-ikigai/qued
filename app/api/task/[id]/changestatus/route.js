import { connectToDB } from '@/utils/database'
import { Task } from '@/models/task'
import { parse } from 'url'

/**
 * Updates the status of a specific task, ensuring that only authorized users can make the change.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters of the route, containing the task ID.
 * @returns {Response} - The HTTP response object with the updated task or an error message.
 */
export const PATCH = async (req, { params }) => {
  // Ensure that only PATCH method is used for this endpoint
  if (req.method !== 'PATCH') {
    console.error('Attempted to access PATCH route with method:', req.method)
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    })
  }

  try {
    // Parse the request URL to extract query parameters
    const parsedUrl = parse(req.url, true)
    const { userId } = parsedUrl.query

    // Establish database connection
    await connectToDB()

    // Fetch the task by ID and verify ownership
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

    // Extract the new status from the request body
    const { status } = await req.json()

    // Update the task status in the database
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      { status },
      { new: true },
    )

    // Return the updated task information
    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Log the error to aid in debugging
    console.error('Error updating task status for task ID:', params.id, error)
    // Return a 500 Internal Server Error response
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to update task status due to an internal error.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
