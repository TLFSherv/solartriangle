
export default function Button({ text, type = "button", form, style }:
    { text: string, type?: "button" | "submit" | "reset" | undefined, form?: string, style?: string }) {
    return (
        <button
            type={type}
            form={form}
            className={`py-4 px-6 rounded-2xl cursor-pointer tracking-wider ${style}`}>
            {text}
        </button>
    )
}