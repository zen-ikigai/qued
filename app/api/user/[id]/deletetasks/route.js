import { connectToDB } from "@/utils/database";
import { Task } from "@/models/task";
import { User } from "@/models/user";

export const DELETE = async (req, { params }) => {
    if (req.method !== "DELETE") return new Response("Method not allowed", {status:405});
    
    try{
        await connectToDB();
        await Task.deleteMany({ creator: params.id });
        await User.findByIdAndUpdate(params.id, { $set: { tasks: [] } });   

        return new Response("All tasks deleted and user task list cleared", {status:200});

    } catch(error) {
        console.log(error);
        return new Response("Failed to delete all Tasks", {status:500})
    }
}