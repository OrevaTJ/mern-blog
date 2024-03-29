import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useImageUpload } from '../utils/imageUtils';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdatePost() {
  // Image upload state and functionality
  const {
    handleImageFileUpload,
    imageUploadPercent,
    isImageUploading,
    imageUploadError,
    setImageUploadError,
  } = useImageUpload();
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  // Effect to fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setPublishError(null);

      try {
        const res = await fetch(`/api/post/?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }

        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]); // Returns an array
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  // Function to handle image upload
  const handleUploadImage = () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    handleImageFileUpload(file)
      .then((downloadUrl) => {
        setFormData({ ...formData, image: downloadUrl });
      })
      .catch((error) => {
        setImageUploadError('Error uploading image:', error.message);
      });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    if (isImageUploading) return;

    try {
      const res = await fetch(
        `/api/post/update/${formData._id}/${formData.userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            value={formData.title}
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadPercent}
          >
            {imageUploadPercent ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadPercent}
                  text={`${imageUploadPercent || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          value={formData.content}
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
