import React, {useState, useEffect,useRef} from 'react'
import { submitComment } from '../services';

const CommentsForm = ({slug}) => {
    const [error, setError] = useState(false);
    const [localStorage, setLocalStorage] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const commentEL = useRef();
const nameEL = useRef();
const emailEL = useRef();
const storeDataEL = useRef();
useEffect(() => {
    nameEL.current.value=window.localStorage.getItem('name');
    emailEL.current.value=window.localStorage.getItem('email');
  }, [])

const handlePostSubmission = () => {
  setError(false);
const {value:comment} = commentEL.current;
const {value:name} =nameEL.current;
const {value:email} =emailEL.current;
const {checked:storeData} =storeDataEL.current;
  if (!name|| !email|| !comment) {
    setError(true);
    return;
  };
  const commentObj = {
    name,
    email,
    comment,
    slug,
  };
  if (storeData) {
    window.localStorage.setItem('name', name);
    window.localStorage.setItem('email', email);
  } else {
   window.localStorage.removeItem('name');
    window.localStorage.removeItem('email');
  }

submitComment(commentObj)
.then((res) => {
  setShowSuccessMessage(true);

  setTimeout(() =>{
    setShowSuccessMessage(false)
  },3000)
})


}

  return (


    <div className="bg-white dark:bg-black shadow-lg rounded-lg p-8 pb-12 mb-8">
    <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
    <div className="grid grid-cols-1 gap-4 mb-4">
      <textarea
ref={commentEL}
placeholder='Comment'
name='comment'
      className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-white dark:text-white dark:bg-black"
/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input type="text" ref={nameEL}  className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-black dark:text-white" placeholder="Name" name="name"
/>
        <input type="email" ref={emailEL} className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-black dark:text-white" placeholder="Email" name="email"
      />
      </div>


      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <input ref={storeDataEL} type="checkbox" id="storeData" name="storeData" value="true" />
          <label className="text-black dark:text-white cursor-pointer ml-2" htmlFor="storeData"> Save my name, email in this browser for the next time I comment.</label>
        </div>
      </div>




      {error && <p className="text-xs text-red-500">All fields are mandatory</p>}

      <div className="mt-8">
        <button type="button" onClick={handlePostSubmission} className="transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Post Comment</button>
        {showSuccessMessage && alert("comment sucessfully submitted for review!") }
      </div>



</div>
  )
}


export default CommentsForm;