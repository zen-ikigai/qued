import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { User } from "@/models/user";

/**
 * Handles the DELETE request to remove a user's profile along with all their tasks.
 * Ensures that the operation is secure and atomic, with informative error handling.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters of the route, containing the user ID.
 * @returns {Response} - The HTTP response object.
 */
export const DELETE = async (req, { params }) => {
    if (req.method !== "DELETE") {
        // Return error response if the request method is not DELETE
        console.error("Attempted to access DELETE route with method:", req.method);
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        // Establish a connection to the database
        await connectToDB();

        // First attempt to find the user to ensure the user exists
        const user = await User.findById(params.id);
        if (!user) {
            console.error("No user found with ID:", params.id);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Delete all tasks created by the user
        await Task.deleteMany({ creator: params.id });
        
        // Delete the user profile
        await User.findByIdAndDelete(params.id);

        // Respond with success message
        return new Response(JSON.stringify({ message: "Profile and all associated tasks deleted successfully" }), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });

    } catch (error) {
        // Log the error and return a 500 internal server error response
        console.error("Error while deleting user profile and tasks:", error);
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: "An unexpected error occurred while deleting the user profile."
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
};
