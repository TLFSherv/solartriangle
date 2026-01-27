'use server'
import { z } from "zod"
import { verifyPassword } from "@/app/lib/auth"
import { getUserByEmail, createUser, createSession, deleteSession, verifySession } from "@/app/lib/dal";
import { redirect } from "next/navigation";

const SignInSchema = z.object({
    email: z.email("Invalid email format").min(1, 'Email is required'),
    password: z.string().min(6, "Password must be 6 or more characters")
});

const SignUpSchema = z.object({
    email: z.email("Invalid email format").min(1, 'Email is required'),
    password: z.string().min(6, "Password must be 6 or more characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ['confirmPassword']
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
            email: formData.get('email') as string,
            password: formData.get('password') as string
        }

        const validationResult = SignInSchema.safeParse(data);
        if (!validationResult.success)
            return {
                success: false,
                message: 'Validation failed',
                errors: z.flattenError(validationResult.error).fieldErrors
            }

        const user = await getUserByEmail(data.email);
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                errors: {
                    username: ['Invalid email or password']
                }
            }
        }

        const isPasswordValid = await verifyPassword(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid email or password',
                errors: {
                    password: ['Invalid email or password']
                }
            }
        }

        await createSession(user.id, user.email);

        return {
            success: true,
            message: 'Signed in successfully',
            error: ''
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: 'Issue with sign in'
        };
    }
}

// validate form fields on server
export async function signUp(formData: FormData): Promise<ActionResponse> {
    try {
        // Extract data from form
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string
        }

        const validationResult = SignUpSchema.safeParse(data);

        if (!validationResult.success)
            return {
                success: false,
                message: 'Validation failed',
                errors: z.flattenError(validationResult.error).fieldErrors
            }

        // Check if user already exists
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            return {
                success: false,
                message: 'Inavlid username or password',
                errors: {
                    username: ['Invalid username or password']
                }
            };
        }

        // Create new user
        const user = await createUser(data.email, data.password)
        if (!user) {
            return {
                success: false,
                message: 'Failed to create user',
                error: 'Failed to create user'
            };
        }

        // Create the session for the newly registered user
        await createSession(user.id, user.email);

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
        redirect('/signin')
    }
}