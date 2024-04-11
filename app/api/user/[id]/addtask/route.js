import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { User } from "@/models/user";


export const POST = async (req, { params }) => {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    try {

        await connectToDB();

        // Find the user by ID
        const user = await User.findById(params.id);

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Extract task details from the request body
        const taskDetails = await req.json();
        const { title, description, status, dueDate, reminder } = taskDetails;

        // Create and save the new task
        const newTask = new Task({
            creator: user._id, 
            title,
            description,
            status,
            dueDate,
            reminder,            
        });

        await newTask.save();
        user.tasks.push(newTask);
        await user.save()

        return new Response(JSON.stringify(newTask), {
            status: 201, 
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.log(error);
        return new Response("Failed to create task", { status: 500 });
    }
}
