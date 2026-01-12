import UserEvent from "../models/userEvent.model.js";

export const logEvent = async ({
    userId,
    foodId,
    eventType,
    value=1
})=>{
    try{
        await UserEvent.create({
            user:userId,
            food:foodId,
            eventType,
            value
        });
    } catch(error){
        console.error("Failed to log event:",error.message);
    }
};
/*
Key learning

This is called side-effect isolation:

UI stays fast

core logic is safe

failures don’t break the app
*/