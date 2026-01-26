declare module 'custom-env' {
    export function env(
        env?: string,
        config?: {
            path?: string
            verbose?: boolean
        }
    ): void
}
