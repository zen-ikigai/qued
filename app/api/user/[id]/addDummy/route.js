import { connectToDB } from '@/utils/database'
import { Task } from '@/models/task'
import { User } from '@/models/user'

const createDummyTasks = () => {
    const baseDate = new Date();
    return [
      ...Array.from({ length: 3 }).map((_, i) => ({
        title: `Task ${i + 1}`,
        description: "Lorem Ipsum Dolor",
        status: "todo",
        dueDate: new Date(baseDate.getTime() + ((i - 1) * 2 * 86400000)), // -2, 0, +2 days
        reminder: false,
      })),
      ...Array.from({ length: 3 }).map((_, i) => ({
        title: `Task ${i + 4}`,
        description: "Lorem Ipsum",
        status: "inProgress",
        dueDate: new Date(baseDate.getTime() + ((i - 1) * 2 * 86400000)), // -2, 0, +2 days
        reminder: false,
      })),
      ...Array.from({ length: 3 }).map((_, i) => ({
        title: `Task ${i + 7}`,
        description: "Lorem Ipsum",
        status: "done",
        dueDate: new Date(baseDate.getTime() + ((i - 1) * 2 * 86400000)), // -2, 0, +2 days
        reminder: false,
      })),
    ];
  };
  

/**
 * Handles the POST request to add 6 new dummy tasks for a specified user.
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

    const dummyTasks = createDummyTasks();
    const tasks = await Task.insertMany(
        dummyTasks.map(task => ({ ...task, creator: user._id }))
      );
    
    user.tasks.push(...tasks.map(task => task._id));
    await user.save();   

    // Respond with the newly created task
    return new Response('Added Dummy Data Successfully', {
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
