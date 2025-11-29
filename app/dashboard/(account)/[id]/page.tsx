export default async function Dashboard({
    params, }: {
        params: Promise<{ id: string }>
    }) {
    const { id } = await params;
    return (
        <h1>User {id}'s dashboard</h1>
    )
}

