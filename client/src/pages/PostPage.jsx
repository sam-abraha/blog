import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { formatISO9075 } from "date-fns";

export default function  PostPage() {

    const {id} = useParams();
    const [post, setPost] = useState(null)
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

    return (
        <div className="mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="font-bold text-4xl mb-2">{post.title}</h1>
                <div classame="text-gray-600">
                By <span className="font-semibold"> {post.author.name}</span> | {new Date(post.createdAt).toISOString().split('T')[0]}
                </div>
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