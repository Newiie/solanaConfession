import React, {useState} from 'react'

const Modal = ({setShow, initializeConfession, postId, setChanged}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className='modal'>
      <form action="">
        <div className='form-item'> 
          <label htmlFor="title">Title</label>
          <input type="text" name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title: ' />
        </div>
        <div className='form-item'>
          <label htmlFor="content">Content</label>
          <textarea name="content" onChange={(e) => setContent(e.target.value)} id="" cols="30" rows="10" placeholder='Content----'></textarea>
        </div>
        
        <div className='button-container'>

          {(postId ? (
            <button type="button" onClick={async (e) => {
              await initializeConfession(title.toString(), content.toString(), postId)
              setChanged(true);
              setShow(false)
            }}>Edit Confession</button>
          ) : (
            <button type="button" onClick={async (e) => {
              await initializeConfession(title.toString(), content.toString())
              setShow(false)
            }}>Submit</button>
          )) 
           }
          <button type="submit" className='btn-2' onClick={(e) => {
            setShow(false)
          }}>Cancel</button>
        </div>
       
      </form>
    </div>
  )
}

export default Modal
