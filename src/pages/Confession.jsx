import React, { useState, useEffect} from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletName } from "@solana/wallet-adapter-wallets"
import { useConfession } from '../context/Context'
import Posts from '../components/Posts'
import Modal from '../components/Modal'

const Confession = () => {
  const {
    initializeConfession,
    publicKey,
    posts,
    program,
    updateConfession,
  } = useConfession();

  const [show, setShow] = useState(false)
  const { connected, select } = useWallet()
  const [postShow, setPost] = useState("")

  const handlePostClick = (postId) => {
    setPost(postId)
  };

  const onConnect = async () => {
    try {
      await select(PhantomWalletName);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return (
    <>
    <div>
        <div className="nav-bar">
          <h1 className='clr-vpo'>CONFESSION</h1>
          {publicKey ? (
            <h2>{publicKey.toString().slice(0,5)+ "...." + publicKey.toString().slice(-5)}</h2>
          ) : (
            <h2>Not connected to wallet</h2>
          )}
          {!connected ? (
            <button type="button" className='fw-b' onClick={() => {
              onConnect()
            }}>CONNECT</button>
          ) : (
            <button type="button" className='fw-b' onClick={async () => {
              setShow(true);
            }}>CONFESS</button>
          )
          }
        </div>
        {postShow ? (
          <Posts publicKey={publicKey} postId={postShow} program={program} setPostF={setPost} updateConfession={updateConfession}/>
        )
        : (
        <div id="post-container"> 
          {posts.map((post, index) => {
            return (
              <div key={post.publicKey.toString()} className='post-content' onClick={() => handlePostClick(post.publicKey.toString())}>
                <h4 className='clr-r'>
                  Created by: 
                  {" " + post.account.authority.toString().slice(0, 5) + "..." + post.account.authority.toString().slice(-5)}
                </h4>
                <h2>
                  {post.account.title.length > 14 ? post.account.title.slice(0, 16) + "..." : post.account.title}
                </h2>
                <div className='post-item'>
                  {post.account.content.length > 25 ? post.account.content.slice(0, 25) + "..." : post.account.content}
                </div>
              </div>
            )
          })}
        </div>
        )}
    </div>
    {show && <Modal setShow={setShow} initializeConfession={initializeConfession} />}
    </>
  ) 
}

export default Confession
