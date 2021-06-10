import React, { useState, useRef } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { AddCircleOutlineRounded } from '@material-ui/icons';
import { db, storage } from './firebase';
import firebase from 'firebase/app';
import './ImageUpload.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

function ImageUpload(props) {
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState('');
  const [openUpload, setOpenUpload] = useState(false);

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
            setOpenUpload(false);
            imageInputRef.current.value = '';
          });
      }
    );
  };
  return (
    <>
      <div className="imageupload">
        <i
          // variant="contained"
          // color="primary"
          className="icon-button create-post"
          onClick={() => setOpenUpload(true)}
        >
          <AddCircleOutlineRounded className="icon-create-post" />
          <span />
        </i>
      </div>
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        {/* caption input, filepicker, post button */}
        <div className="image__modal">
          {' '}
          <progress
            className="imageupload__progress"
            value={progress}
            max="100"
          />
          <textarea
            type="text"
            placeholder="Enter a caption..."
            onChange={e => setCaption(e.target.value)}
            value={caption}
          />
          <input type="file" onChange={handleChange} ref={imageInputRef} />
          <Button
            variant="contained"
            color="primary"
            disabled={!image}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ImageUpload;
