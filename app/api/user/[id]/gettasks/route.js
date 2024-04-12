import { Task } from "@/models/task";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/database";

/**
 * Retrieves all tasks created by a specific user.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters of the route, containing the user ID.
 * @returns {Response} - The HTTP response object with tasks data or an error message.
 */
export const GET = async (req, { params }) => {
    if (req.method !== "GET") {
        // Only GET method is allowed for this endpoint
        console.error("Attempted to access GET route with method:", req.method);
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        // Establish a database connection
        await connectToDB();

        // Verify if the user exists before fetching their tasks
        const user = await User.findById(params.id);
        if (!user) {
            console.error("No user found with ID:", params.id);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Fetch tasks created by the user, sorted by creation date
        const tasks = await Task.find({ creator: params.id })
            .populate('creator') 
            .sort({ 'createdAt': -1 });

        // Return the tasks to the client
        return new Response(JSON.stringify(tasks), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });

    } catch (error) {
        // Log the error for more detailed analysis
        console.error("Error fetching tasks for user with ID:", params.id, error);
        // Return a 500 Internal Server Error response
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: "Failed to fetch tasks due to an internal error."
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
};
