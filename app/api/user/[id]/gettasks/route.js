import { Task } from "@/models/task";
import { connectToDB } from "@/utils/database"; 


export const GET = async (req, {params}) => {
    if (req.method !== "GET") return new Response("Method not allowed", {status:405});
    try{
        await connectToDB();
        const tasks = await Task.find({ creator:params.id }).populate('creator').sort({ 'createdAt': -1});

        return new Response(JSON.stringify(tasks), {status:200})

    } catch(error) {
        console.log(error);
        return new Response("Failed to fetch tasks created by user", {status:500})
    }
}