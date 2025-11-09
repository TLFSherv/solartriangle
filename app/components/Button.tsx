
export default function Button(props: { text: string }) {
    return (
        <button
            type="button"
            className="flex-1 py-4 px-6 rounded-2xl bg-linear-[#DD6B19,#F0662A] cursor-pointer tracking-wider w-xs">
            {props.text}
        </button>
    )
}