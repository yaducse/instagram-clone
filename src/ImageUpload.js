import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase/app';
import './ImageUpload.css';

function ImageUpload(props) {
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState('');

  const imageInputRef = useRef('');

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              imageUrl: url,
              username: props.username
            });
            setProgress(0);
            setCaption('');
            setImage(null);
            imageInputRef.current.value = '';
          });
      }
    );
  };
  return (
    <div className="imageupload">
      {/* caption input, filepicker, post button */}
      <progress className="imageupload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={e => setCaption(e.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} ref={imageInputRef} />
      <Button disabled={!image} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
