//'use server'
import { z } from "zod"
import { verifyPassword } from "@/app/lib/auth"
import { getUserByUsername, createUser, createSession, deleteSession } from "@/app/lib/dal";
import { redirect } from "next/navigation";

const userSchema = z.object({
    name: z.string().min(1, "name length must be greater than 1")
})

export const user1 = { name: 1 };
// const userValidateResult = userSchema.safeParse(user1);
// if (!userValidateResult.success) {
//     const error = z.prettifyError(userValidateResult.error)
//     console.log(error);
// }


const AuthSchema = z.object({
    username: z.string().min(3, 'Username must be 3 or more characters'),
    password: z.string().min(6, "Password must be 6 or more characters")
});

export type ActionResponse = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
    try {
        // Extract data from form
        const data = {
            username: formData.get('username') as string,
            password: formData.get('password') as string
        }

        const validationResult = AuthSchema.safeParse(data);
        if (!validationResult.success)
            return {
                success: false,
                message: 'Validation failed',
                error: z.prettifyError(validationResult.error)
            }

        const user = await getUserByUsername(data.username);
        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password',
                errors: {
                    username: ['Invalid email or password']
                }
            }
        }

        const isPasswordValid = await verifyPassword(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid username or password',
                errors: {
                    password: ['Invalid username or password']
                }
            }
        }

        await createSession(user.id);

        return {
            success: true,
            message: 'Signed in successfully',
            error: 'Signed in successfully'
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: 'Issue with sign in'
        };
    }
}

export async function signUp(formData: FormData): Promise<ActionResponse> {
    try {
        // Extract data from form
        const data = {
            username: formData.get('username') as string,
            password: formData.get('password') as string
        }

        const validationResult = AuthSchema.safeParse(data);
        if (!validationResult.success)
            return {
                success: false,
                message: 'Validation failed',
                error: z.prettifyError(validationResult.error)
            }

        // Check if user already exists
        const existingUser = await getUserByUsername(data.username);
        if (!existingUser) {
            return {
                success: false,
                message: 'Inavlid username or password',
                errors: {
                    username: ['Invalid username or password']
                }
            };
        }

        // Create new user
        const user = await createUser(data.username, data.password)
        if (!user) {
            return {
                success: false,
                message: 'Failed to create user',
                error: 'Failed to create user'
            };
        }

        // Create the session for the newly registered user
        await createSession(user.id);

        return {
            success: true,
            message: 'Account created successfully',
        }

    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: 'An error occurred while creating your account',
            error: 'Failed to create account'
        }
    }
}

export async function signOut(): Promise<void> {
    try {
        await deleteSession();
    } catch (e) {
        console.error('Sign out error', e);
        throw new Error('Failed to sign out');
    } finally {
        // redirect('/signin')
    }
}