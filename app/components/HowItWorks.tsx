import Button from "./Button"
export default function HowItWorks() {
    return (
        <div className='space-y-18 mx-4 flex flex-col items-center'>
            <div className='flex mx-4 gap-4 text-center'>
                <div className='text-4xl/12 flex-1 my-auto'>
                    <p>IMAGE</p>
                </div>
                <div className='text-4xl/12 flex-1'>
                    <p>
                        HOW IT WORKS HOW IT WORKS HOW IT WORKS
                    </p>
                </div>
            </div>
            <Button />
        </div>
    )
}