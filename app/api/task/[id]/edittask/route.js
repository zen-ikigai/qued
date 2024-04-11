import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { parse } from 'url';

export const PATCH = async (req, { params }) => {
    if (req.method !== "PATCH") return new Response("Method not allowed", {status: 405});

    try {
        const parsedUrl = parse(req.url, true);
        const { userId } = parsedUrl.query;

        await connectToDB();

        const task = await Task.findById(params.id);

        if (!task || task.creator.toString() !== userId) {
            return new Response("Task not found or user not authorized to update this task", {status: 403});
        }
        const taskDetails = await req.json();

        const updatedTask = await Task.findByIdAndUpdate(params.id, taskDetails, { new: true });

        return new Response(JSON.stringify(updatedTask), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.log(error);
        return new Response("Failed to update task", {status: 500});
    }
}
