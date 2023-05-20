'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form } from '@components';


const EditPrompt = () => {

    const router = useRouter();
   
    const searchParams = useSearchParams();
    const promptId = searchParams.get('id'); // Esta url contendrá el id (/update-prompt?id=${post._id}) que queremos actualizar
   
    const [submitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({ prompt: "", tag: "" });

    useEffect(() => {                                                // Cuando entremos a update-prompt
      const getPromptDetails = async () => {                         // obtendremos toda la data del prompt prexistente
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();

        setPost({
            prompt: data.prompt,
            tag: data.tag,
        });
    };

    if (promptId) getPromptDetails();

    },[promptId])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

         if (!promptId) return alert("Missing PromptId!");

        try {
            const response = await fetch(`/api/prompt/${promptId}`, { // LLama al endpoint y envía la nueva data para actualizar
                method: "PATCH",
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag,
                }),
            });

            if (response.ok) {
                router.push("/");
            }
        } catch (error) {
             console.log(error);
        }finally{
            setIsSubmitting(false);
        }
    };

    return (
        <Form 
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
    )
}

export default EditPrompt