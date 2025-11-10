
export default function Button(props: { text: string, style?: string }) {
    return (
        <button
            type="button"
            className={`py-4 px-6 rounded-2xl cursor-pointer tracking-wider ${props?.style}`}>
            {props.text}
        </button>
    )
}