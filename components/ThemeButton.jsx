import { useTheme } from "next-themes";
import {BsFillMoonStarsFill} from "react-icons/bs"
import {BsFillEmojiSunglassesFill} from "react-icons/bs"
import {BsSun} from "react-icons/bs"
const ThemeButton = () =>{
    const {resolvedTheme , setTheme} = useTheme()
    return(
        <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="cursor-pointer border-0 border-transparent focus:ring-0">
{
    resolvedTheme === "dark" ?
    (<BsSun className="text-[25px] text-yellow-300"/>)
    :
    (<BsFillMoonStarsFill className="text-[25px] text-white"/>)
}
        </button>
    )
}
export default ThemeButton