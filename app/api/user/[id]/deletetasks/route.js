import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { User } from "@/models/user";

/**
 * Handles the DELETE request to remove all tasks associated with a given user.
 * This action also clears the task list from the user's document for consistency.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters of the route, containing the user ID.
 * @returns {Response} - The HTTP response object.
 */
export const DELETE = async (req, { params }) => {
    if (req.method !== "DELETE") {
        // Ensure only DELETE method is permissible for this route
        console.error("Attempted to access DELETE route with method:", req.method);
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        // Establish a database connection
        await connectToDB();

        // Check if the user exists before attempting to delete their tasks
        const user = await User.findById(params.id);
        if (!user) {
            console.error("No user found with ID:", params.id);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Delete all tasks created by the user
        await Task.deleteMany({ creator: params.id });

        // Clear the tasks array in the user document
        await User.findByIdAndUpdate(params.id, { $set: { tasks: [] } });

        // Return success response
        return new Response(JSON.stringify({ message: "All tasks deleted successfully and user task list cleared." }), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });

    } catch (error) {
        // Log the full error and return a 500 internal server error response
        console.error("Error while deleting all tasks for user:", error);
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: "An unexpected error occurred while deleting all tasks for the user."
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
};
