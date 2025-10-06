import React, { useState, useEffect, useRef } from "react";
import { submitComment } from "../services";
import { ClipLoader } from "react-spinners";
const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 new loading state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const commentEL = useRef();
  const nameEL = useRef();
  const emailEL = useRef();
  const storeDataEL = useRef();

  useEffect(() => {
    nameEL.current.value = window.localStorage.getItem("name") || "";
    emailEL.current.value = window.localStorage.getItem("email") || "";
  }, []);

  const handlePostSubmission = async () => {
    setError(false);

    const { value: comment } = commentEL.current;
    const { value: name } = nameEL.current;
    const { value: email } = emailEL.current;
    const { checked: storeData } = storeDataEL.current;

    if (!name || !email || !comment) {
      setError(true);
      return;
    }

    const commentObj = { name, email, comment, slug };

    if (storeData) {
      window.localStorage.setItem("name", name);
      window.localStorage.setItem("email", email);
    } else {
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("email");
    }

    // 👇 show loading
    setLoading(true);

    try {
      await submitComment(commentObj);
      setShowSuccessMessage(true);

      // clear fields
      commentEL.current.value = "";
      nameEL.current.value = "";
      emailEL.current.value = "";
      storeDataEL.current.checked = false;

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      // 👇 hide loading
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea
          ref={commentEL}
          placeholder="Comment"
          name="comment"
          className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-black dark:text-white dark:bg-black"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          ref={nameEL}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 dark:bg-black text-black dark:text-white"
          placeholder="Name"
          name="name"
        />
        <input
          type="email"
          ref={emailEL}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 dark:bg-black text-black dark:text-white"
          placeholder="Email"
          name="email"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <input ref={storeDataEL} type="checkbox" id="storeData" name="storeData" value="true" />
          <label
            className="text-black dark:text-white cursor-pointer ml-2"
            htmlFor="storeData"
          >
            Save my name, email in this browser for the next time I comment.
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">All fields are mandatory</p>}

      <div className="mt-8">
        <button
          type="button"
          onClick={handlePostSubmission}
          disabled={loading} // 👈 disable when loading
          className={`transition duration-500 ease hover:bg-indigo-900 inline-block ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600"
          } text-lg font-medium rounded-full text-white px-8 py-3`}
        >
          {loading ? <ClipLoader size={25} color="white"/> : "Post Comment"} {/* 👈 loading text */}
        </button>

        {showSuccessMessage && (
          <p className="text-green-500 text-sm mt-2">
            Comment successfully submitted for review!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsForm;
