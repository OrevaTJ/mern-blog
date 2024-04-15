import { Button, Spinner } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { httpGetSingleUser } from '../api-services/user';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  // Get single post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/post/?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // Effect hook to fetch user data of the post
  const getUser = useCallback(async () => {
    post && setPostUser(await httpGetSingleUser(post.userId));
  }, [post]);

  useEffect(() => {
    post && getUser();
  }, [post, getUser]);

  // Get recent posts for Recent articles section
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/?limit=3`);

        const data = await res.json();

        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };

      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex w-full justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col mx-4 min-h-screen">
      {error && (
        <h1 className="text-sm mt-10 p-3 text-center font-serif max-w-2xl mx-auto">
          An Error occurred.
        </h1>
      )}

      <img
        src={post && post.image}
        alt={post && post.title}
        className="max-h-[400px] w-full object-cover rounded-sm"
      />

      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      />

      {postUser && (
        <div className='p-3 max-w-2xl mx-auto'>
          <h2 className="text-gray-400 text-sm uppercase">about the author</h2>
          <div className="flex items-center flex-shrink-0 gap-2">
            <img
              className="w-20 h-20 rounded-full bg-gray-200"
              src={postUser.profilePhoto}
              alt={'#'}
            />
            <div>
              <h1 className='font-semibold text-lg'>{postUser.name}</h1>
              <h3 className='text-xs mb-2'>@{postUser.username}</h3>
              <p className='text-xs w-1/2'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corporis sequi excepturi vitae dolorem omnis assumenda.
              </p>
            </div>
          </div>
        </div>
      )}

      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
