import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  const [loading, setloading] = useState(undefined);

  const url =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png';

  useEffect(() => {
    setTimeout(() => {
      setloading(true);
    }, 4000);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      // console.log(authUser);
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
      });
  }, []);

  const signUp = async e => {
    e.preventDefault();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch(error => alert(error.message));

    setOpen(false);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const signIn = e => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      {!loading ? (
        <div className="welcome">
          <span id="splash-overlay" className="splash" />
          <span id="welcome" className="z-depth-4" />
        </div>
      ) : (
        <>
          <div className="App">
            <Modal open={open} onClose={() => setOpen(false)}>
              <div>
                <form className="app__signup">
                  <center>
                    <img src={url} alt="Instagram" className="app__headerImg" />
                  </center>
                  <Input
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={signUp}>
                    Sign Up
                  </Button>
                </form>
              </div>
            </Modal>
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
              <div>
                <form className="app__signup">
                  <center>
                    <img src={url} alt="Instagram" className="app__headerImg" />
                  </center>
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Button type="submit" onClick={signIn}>
                    Sign In
                  </Button>
                </form>
              </div>
            </Modal>
            <div className="app__header">
              <img src={url} alt="Instagram" className="app__headerImg" />
              {user ? (
                <Button onClick={() => auth.signOut()}>Log Out</Button>
              ) : (
                <div className="login__container">
                  <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                  <Button onClick={() => setOpen(true)}>Sign Up</Button>
                </div>
              )}
            </div>

            <div className="app__posts">
              <div className="app__postsLeft">
                {posts.map(({ id, post }) => (
                  <Post
                    key={id}
                    postId={id}
                    username={post.username}
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                    user={user}
                  />
                ))}
              </div>
              {/* <div className="app__postsRight">
        </div> */}
            </div>
            {/* {user ? console.log('user :', user) : } */}
            {user ? (
              <ImageUpload username={user.displayName} />
            ) : (
              <h3 className="app__notLoginMsg">
                {' '}
                Sorry! You need to login to upload{' '}
              </h3>
            )}
          </div>
        </>
      )}
    </>
  );
}
