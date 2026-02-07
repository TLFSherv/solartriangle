'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className='flex flex-col justify-center mt-20 space-y-6 font-[Space_Grotesk]'>
            <h2 className='text-center text-3xl'>Something went wrong!</h2>
            <p className='text-center px-4'>
                An unexpected error has occured,
                please try reloading the page or try again later.
            </p>
            <button className='mx-auto cursor-pointer bg-[#444444] w-xs rounded-lg py-2 text-lg'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }>
                Try again
            </button>
        </div>
    )
}