const TextButton = ({title, text}) => {
    return (
        <li className="rounded-md p-4 bg-sportsBlue text-sportsTan text-left">
            <h3 className="font-bold text-white text-xl mb-3">{title}</h3>
            <p>{text}</p>
        </li>
    );
}

export default TextButton;