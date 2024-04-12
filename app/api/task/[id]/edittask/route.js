import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { parse } from 'url';

/**
 * Updates an existing task if the user is authorized.
 * 
 * @param {Request} req - The incoming request object.
 * @param {Object} params - Route parameters including the task ID.
 * @returns {Response} - The response object with status and headers set, indicating success or failure.
 */
export const PATCH = async (req, { params }) => {
    // Ensure the method is PATCH
    if (req.method !== "PATCH") {
        console.error("Attempted to access PATCH route with method:", req.method);
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        // Parse the request URL to get user ID
        const parsedUrl = parse(req.url, true);
        const { userId } = parsedUrl.query;

        // Establish database connection
        await connectToDB();

        // Fetch the task by ID and verify that the requesting user is the task creator
        const task = await Task.findById(params.id);
        if (!task || task.creator.toString() !== userId) {
            console.error("Task not found or unauthorized update attempt by user:", userId);
            return new Response(JSON.stringify({ error: "Unauthorized access or task not found" }), { status: 403 });
        }

        // Parse the request body for updated task details
        const taskDetails = await req.json();
        const { title, description, status, dueDate, reminder } = taskDetails;

        // Validate required fields
        if (!title || !description || !status) {
            console.error("Validation error: Missing required fields for task ID:", params.id);
            return new Response(JSON.stringify({
                error: "Validation failed",
                message: "Missing required fields: title, description, and/or status."
            }), {
                status: 400, 
                headers: {'Content-Type': 'application/json'}
            });
        }

        // Update the task in the database
        const updatedTask = await Task.findByIdAndUpdate(params.id, taskDetails, { new: true });

        // Return the updated task details
        return new Response(JSON.stringify(updatedTask), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error updating task for task ID:", params.id, error);
        // Return a 500 Internal Server Error response
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: "Failed to update task due to an internal error."
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
