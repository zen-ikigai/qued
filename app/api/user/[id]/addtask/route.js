import { connectToDB } from '@/utils/database'
import { Task } from '@/models/task'
import { User } from '@/models/user'

/**
 * Handles the POST request to add a new task for a specified user.
 * Validates necessary fields and creates a new task entry in the database.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters of the route, containing the user ID.
 * @returns {Response} - The HTTP response object.
 */
export const POST = async (req, { params }) => {
  if (req.method !== 'POST') {
    // Return error response if the request method is not POST
    console.error('Attempted to access POST route with method:', req.method)
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    })
  }

  try {
    // Establish a connection to the database
    await connectToDB()

    // Fetch the user associated with the ID from the route parameters
    const user = await User.findById(params.id)
    if (!user) {
      console.error('No user found with ID:', params.id)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    // Extract task details from the request body
    const taskDetails = await req.json()
    const { title, description, status, dueDate, reminder } = taskDetails

    // Ensure all required fields are present
    if (!title || !description || !status) {
      console.error('Validation failed for task details:', taskDetails)
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          message: 'Title, description, and status are required fields.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Create a new task and append it to the user's task list
    const newTask = new Task({
      creator: user._id,
      title,
      description,
      status,
      dueDate,
      reminder,
    })
    await newTask.save()
    user.tasks.push(newTask._id)
    await user.save()

    // Respond with the newly created task
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Log the error and return a 500 internal server error response
    console.error('Error while creating task:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while creating the task.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
