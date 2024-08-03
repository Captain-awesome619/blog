import React, {useContext,useState,useEffect} from 'react'
import Link from 'next/link'
import { getCategories } from '../services'
import ThemeButton from "./ThemeButton"
const Header = () => {

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories()
    .then((newCategories) => {
      setCategories(newCategories);
    });
  }, []);

  const [mounted, setmounted] = useState(false)
  useEffect(() => setmounted(true,[]))


  return (
    <div>
<div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full flex justify-between  py-8">
        <div className="md:float-left flex items-center justify-between  ">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl ">Dark-Vale</span>
          </Link>

        </div>
        <div className='flex items-center justify-center gap-[2rem]'>
        <div className="hidden md:float-left md:flex ">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}><span className="md:float-right mt-2 align-middle  ml-4 font-semibold cursor-pointer">{category.name}</span></Link>
          ))}

        </div>
        <div className=' md:float-right md:contents'>{mounted && <ThemeButton/>}</div>
</div>

      </div>
    </div>
    </div>
  )
}

export default Header