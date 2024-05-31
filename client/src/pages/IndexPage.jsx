import Post from "../components/Post";
import { useState } from "react";
import { useEffect } from "react";

export default function IndexPage() {
    const [posts,setPosts] = useState([]);
    useEffect(() => {
      fetch('http://localhost:3000/posts').then(response => {
        response.json().then(posts => {
          setPosts(posts);
        });
      }).catch(error => {
        console.log('Error fetching all posts',error)
      })
    }, []);
    return (
      <>
        {posts.length > 0 && posts.map(post => (
          <Post {...post} />
        ))}
      </>
    );
  }