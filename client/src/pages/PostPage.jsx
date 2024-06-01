import { useContext, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function  PostPage() {

    const {id} = useParams();
    const [post, setPost] = useState(null)
    const {userInfo} = useContext(UserContext)
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
            .then(res => res.json())
            .then(postInfo => {
                setPost(postInfo);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id])

    if (!post) {
        // Loading Page in case post is null
        return (
            <div className="flex flex-col items-center justify-center h-screen text-lime-600">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-lime-600 border-solid border-t-transparent"></div>
                <div className="mt-4 text-2xl font-bold">Loading...</div>
            </div>
        );
        
    }

    async function deletePost() {
        try {
          const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (response.ok) {
            setRedirect(true);
          } else {
            console.log('Failed to delete post', response.statusText);
          }
        } catch (error) {
          console.log('Failed to delete post', error);
        }
      }
      

    if(redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="font-bold text-4xl mb-2">{post.title}</h1>
                <div className="text-gray-600">
                By <span className="font-semibold"> {post.author.name}</span> | {new Date(post.createdAt).toISOString().split('T')[0]}
                </div>
                {userInfo?.id === post.authorId && (
                <Link to={`/edit-post/${id}`} className="font-semibold text-lime-600 hover:underline mt-2 block">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                    <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                    </svg>
                    </Link>
                )}
                {userInfo?.id === post.authorId && (
                    <button onClick={deletePost} className="text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                            <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                )}
                <div className="mt-2 text-gray-500">{post.summary}</div>
            </div>
            <div className="mb-8">
                <img className="w-full rounded-lg shadow-lg" src={`http://localhost:3000/${post.cover}`}></img>
            </div>
            <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{__html:post.content}}></div>
            </div>
        </div>

    )
 

}