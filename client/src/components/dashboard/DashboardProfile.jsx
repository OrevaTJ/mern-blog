import { Alert, Button, TextInput } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../../redux/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { SignOut } from '../../utils/authUtils';
import { useImageUpload } from '../../utils/imageUtils';
import { DeleteModal } from '../../utils/modalUtils';

export default function DashboardProfile() {
  // Ref for image input
  const imageFileRef = useRef(null);

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Redux state
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Image upload state and functionality
  const {
    handleImageFileUpload,
    imageUploadPercent,
    isImageUploading,
    imageUploadError,
  } = useImageUpload();
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Handler for image change
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setImageFile(image);
      setImageFileUrl(URL.createObjectURL(image)); // show temporary before getting profile photo from db
    }
  };

  // Effect for handling image upload
  useEffect(() => {
    if (imageFile) {
      handleImageFileUpload(imageFile)
        .then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePhoto: downloadUrl });
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          setImageFile(null);
          setImageFileUrl(null);
        });
    }
  }, [imageFile]);

  // Handler for form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(null);

    if (isImageUploading) return;

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess('Update successful');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Handler for deleting user account
  const handleDelete = async () => {
    setShowModal(false);
    deleteUserStart();

    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      navigate('/');
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageFileRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => imageFileRef.current.click()}
        >
          {imageUploadPercent && (
            <CircularProgressbar
              value={imageUploadPercent || 0}
              text={`${imageUploadPercent}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadPercent / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePhoto}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadPercent && imageUploadPercent < 100 && 'opacity-60'
            }`}
          />
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || isImageUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={() => SignOut(dispatch)} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateSuccess && (
        <Alert color="success" className="mt-5">
          {updateSuccess}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
