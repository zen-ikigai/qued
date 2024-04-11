import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { User } from "@/models/user";
import { parse } from 'url';

export const GET = async (req, { params }) => {
    if (req.method !== "GET") return new Response("Method not allowed", {status:405});
    
    try{
        const parsedUrl = parse(req.url, true);
        const { userId } = parsedUrl.query;

        await connectToDB();

        const task = await Task.findById(params.id);
        if (!task || task.creator.toString() !== userId) {
            return new Response("Task not found or user not authorized to delete this task", {status: 403});
        }

        return new Response(JSON.stringify(task), {status:200});

    } catch(error) {
        console.log(error);
        return new Response("Failed to delete Task", {status:500})
    }
}