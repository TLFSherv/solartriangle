import Button from "../components/Button"
export default function Learn() {
    return (
        <div className="m-6 space-y-8">
            <h1 className="font-[Darker_Grotesque] text-6xl md:text-7xl">
                What is this?
            </h1>
            <p className="font-[Inter] font-light text-lg sm:text-xl">
                This is a distillation of the notes I’ve made during my journey to learn about solar panels.
                I hope the way I’ve organised and explained the content helps you understand this fascinating topic like it did for me.
                Welcome
            </p>
            <div className="font-[Inter] font-light text-lg sm:text-xl">
                <Button
                    text="Start"
                    style="bg-linear-[#DD6B19,#F0662A] w-2xs"
                />
            </div>
        </div>
    )
}