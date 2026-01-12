import mongoose from "mongoose";

const userEventSchema = new mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"food",
        required:true,
    },
    eventType:{
        type:String,
        enum:["watch","like","save","skip"],
        required:true
    },
    value: {
        type:Number,
        default:1
        /*
        watch → seconds watched
        like/save → 1
        skip → 1
      */
    }
},
{timestamps:true}
);

export default mongoose.model("UserEvent",userEventSchema);
/*
WHY this design (important)

One table for all behaviors → simple

eventType keeps it flexible

value lets the same schema support ML later

timestamps = time awareness (critical for AI)
*/