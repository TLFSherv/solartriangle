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

export async function createUser(username: string, password: string) {
    return { id: '1', password: 'testtest' }
}