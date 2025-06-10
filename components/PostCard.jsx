import React from 'react'
import moment from 'moment'
import Link from 'next/link'



const PostCard = ({post}) => {
  return (

<div className=" border-2 bg-white dark:bg-black transition  duration-400 ease dark:shadow-[5px_5px_5px_1px_rgba(255,255,255)] shadow-[5px_5px_5px_1px_rgba(0,0,0,0.3)]  rounded-lg p-0 lg:p-8 pb-12 mb-8">
    <div className="relative justify-center  shadow-md flex w-full h-60 lg:h-80 mb-6">
      <img
        alt={post.title}
        className="shadow-lg rounded-t-lg lg:rounded-lg lg:mx-10 "
        src={post.featuredImage.url}
      />
    </div>
    <h1 className=" text-center mb-8 cursor-pointer hover:text-pink-600 text-3xl font-semibold">
      <Link href={`/post/${post.slug}`}>{post.title}</Link>
    </h1>
    <div className="block lg:flex text-center items-center justify-center mb-8 w-full">
      <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-8 ">
        <img
          alt={post.author.name}
          height="30px"
          width="30px"
          className="align-middle rounded-full"
          src={post.author.photo.url}
        />
<p  className="inline align-middle ml-2 font-medium text-lg">{post.author.name}</p>
</div>
<div className="font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>

</div>
</div>

<p className="text-center text-black dark:text-white text-lg font-normal px-4 lg:px-20 mb-8">
      {post.excerpt}
    </p>
    <div className="text-center ">
      <Link href={`/post/${post.slug}`}>
        <span className=" transform hover:-translate-y-1 duration-500 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Continue Reading</span>
      </Link>
    </div>
    </div>
  );
}

export default PostCard;