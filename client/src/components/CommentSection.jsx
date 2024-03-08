import PropTypes from 'prop-types';

import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { DeleteModal } from '../utils/modalUtils';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  // Get all comments of a post
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPostComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  // Create new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (commentContent.length > 200) {
      return;
    }

    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCommentContent('');
        // new comment first, then add prev comments
        setPostComments([data, ...postComments]);
      }
    } catch (error) {
      setCommentError(error.message);
      setCommentContent('');
    }
  };

  // Toggle like and update number of likes fo a post
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });

      if (res.ok) {
        const data = await res.json();
        setPostComments(
          postComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Update edited comment of a post
  const handleEdit = async (editedComment) => {
    setPostComments(
      postComments.map((comment) =>
        comment._id === editedComment._id
          ? { ...comment, content: editedComment.content }
          : comment
      )
    );
  };

  // Delete a comment
  const handleDelete = async (commentId) => {
    setShowModal(false);

    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPostComments(
          postComments.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3 min-h-screen">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePhoto}
            alt=""
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setCommentContent(e.target.value)}
            value={commentContent}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - commentContent.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {postComments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{postComments.length}</p>
            </div>
          </div>
          {postComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={() => handleDelete(commentToDelete)}
        whatToDelete="comment"
      />
    </div>
  );
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};
