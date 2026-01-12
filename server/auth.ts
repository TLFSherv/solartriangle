import { z } from "zod"

const UserSchema = z.object(
    {
        username: z.string(),
        password: z.string()
    }
)

export const user1 = { username: "1" };

// console.log(UserSchema.parse(user1));