import { connectToDB } from '@/utils/database'
import { Task } from '@/models/task'
import { User } from '@/models/user'
import { parse } from 'url'

/**
 * Deletes a specific task only if the requesting user is authorized.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The route parameters, containing the task ID.
 * @returns {Response} - The HTTP response object indicating success or failure.
 */
export const DELETE = async (req, { params }) => {
  // Check if the method is DELETE to enforce correct HTTP method usage
  if (req.method !== 'DELETE') {
    console.error('Attempted to access DELETE route with method:', req.method)
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    })
  }

  try {
    // Parse the request URL for additional parameters
    const parsedUrl = parse(req.url, true)
    const { userId } = parsedUrl.query

    // Establish database connection
    await connectToDB()

    // Fetch the task by ID and verify that the requesting user is the task creator
    const task = await Task.findById(params.id)
    if (!task || task.creator.toString() !== userId) {
      console.error(
        'Task not found or unauthorized delete attempt by user:',
        userId,
      )
      return new Response(
        JSON.stringify({ error: 'Unauthorized access or task not found' }),
        { status: 403 },
      )
    }

    // Delete the task and update the user's task list
    await Task.findByIdAndDelete(params.id)
    await User.findByIdAndUpdate(userId, { $pull: { tasks: params.id } })

    // Confirm successful deletion
    return new Response(
      JSON.stringify({ message: 'Task deleted successfully' }),
      { status: 200 },
    )
  } catch (error) {
    // Log the error to aid debugging
    console.error('Error deleting task for task ID:', params.id, error)
    // Return a 500 Internal Server Error response
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to delete task due to an internal error.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
