import React, { useEffect, useState } from 'react'
import Modal from './Modal';


const Posts = ({postId, program, setPostF, updateConfession, publicKey}) => {
    const [post, setPost] = useState(null);
    const [show, setShow] = useState(false);
    const [changed, setChanged] = useState(false);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        try {
            const getPost = async () => {
                console.log("POST ID:", postId)
                console.log("PROGRAM: ", program);
                const post = await program.account.confession.fetch(postId);
                console.log("POST ", post);
                setPost(post);
                if (post.authority.toString() == publicKey.toString()) setAllowed(true);
                // console.log("Post Authority: ", post.authority.toString());
                // console.log("Pub key: ", publicKey.toString());
            }
            getPost()
        } catch (err) {
            console.log("Post err: ", err)
        } finally {
            setChanged(false);
        }
    }, [changed])

    if (!post) {
        return (
            <div>
                {/* NOSHIT */}
            </div>
        )
    }

    return (
        <>
        <form action="" id='POST'>
            <h3 className='clr-r'>CREATED BY: {post.authority.toString()}</h3>
            <h1 className='clr-o'>{post.title}</h1>
            <p>{post.content}</p>
            <div className='button-container'>
            {allowed && <button type="button" onClick={(e) => {
                setShow(true)
            }}>Edit</button>}
            <button type="submit" className='btn-2' onClick={(e) => {
                setPostF("")
            }}>Cancel</button>
            </div>
        </form>
        {show && <Modal setShow={setShow} setChanged={setChanged} postId={postId} initializeConfession={updateConfession}></Modal>}
        </>
    )
  }

export default Posts
