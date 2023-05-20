"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {

    const router = useRouter();
    const {data:session} = useSession();
    const [post, setPost] = useState([]);

    useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);  // Fetch para obtener los prompts de un usuario según id.
      const data = await response.json();
      setPost( data );
    }
    if(session?.user.id) fetchPost();
  },[]);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`); // Te redirige a la página de actualización del prompt
    };

    const handleDelete = (post) => {
        
    };



  return (
    <Profile 
        name="My"
        desc="Welcome to your personalized profile page"
        data={post}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
    />
  )
}

export default MyProfile