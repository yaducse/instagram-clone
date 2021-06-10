import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase/app';

function Post({ postId, username, user, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  // console.log('username :', username);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
          setComments(
            snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = e => {
    e.preventDefault();
    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/* header -> avatar + username */}

      <img className="post__image" src={imageUrl} alt="" />
      {/* post */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      {/* username + caption */}

      <div className="post__comments">
        {comments.map(comment => (
          <p key={comment.id}>
            <strong>{comment.data.username}</strong> {comment.data.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            type="text"
            className="post__input"
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="post__button"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
