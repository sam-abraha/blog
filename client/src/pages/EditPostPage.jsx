import {Navigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import TextEditor from "../components/TextEditor"

export default function EditPostPage() {
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [files, setFiles] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
            .then(res => res.json())
            .then(post => {
                setTitle(post.title);
                setContent(post.content);
                setSummary(post.summary);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    async function updatePost(e)  {
        e.preventDefault()

        const data = new FormData()
        data.append('title', title)
        data.append('summary', summary)
        data.append('content', content)

        if(files && files[0]) {
            data.append('file', files[0])
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method : 'PUT',
                body : data,
                credentials : 'include',
            }
            )
            if(response.ok) {
                setRedirect(true)
            }else {
                console.log('Error updating post :', response.statusText)
            }

        }catch(error) {
            console.log('Error updating post :', error)
        }

    }

    if(redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        <form className="flex flex-col gap-4 mt-12" onSubmit={updatePost}>
            <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title" 
                className="border rounded p-2"
            />
            <input 
                type="text" 
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Summary" 
                className="border rounded p-2"
            />
            <input 
                type="file" 
                onChange={e => setFiles(e.target.files)}
                className="border rounded p-2"
            />
            <TextEditor onChange={setContent} value={content}/>
            <button className="mt-2 border p-2  text-white bg-lime-600 rounded-lg hover:bg-lime-700 w-32">Edit</button>
        </form>
    );
}