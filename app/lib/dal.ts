import db from "../../src/db/connection"
import { users, NewUser } from "../../src/db/schema"
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid"

type User = {
    id: string;
    password: string;
}

export async function getUserByUsername(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
        resolve({ id: '1', password: 'testtest' })
    });
}

export async function createSession(userId: string) {
    console.log('session created');
}

export async function deleteSession() {
    console.log('session deleted');
}

export async function createUser(email: string, password: string) {
    // hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const userFields: NewUser = {
        id: nanoid(),
        email,
        password: hashedPassword,
        dateCreated: new Date()
    };
    // insert the user into the database
    const data = await db
        .insert(users)
        .values(userFields)
        .returning({ id: users.id });

    const user = data[0];

    if (!user) {
        return {
            message: "An error occured when creating user account"
        }
    }

    return user
}