import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fullNameDate } from '../utils/dateUtils';
import { insertPTag } from '../utils/insertHTML';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="mx-2 md:mx-6 min-h-screen">
      {posts.length > 0 && (
        <div
          style={{
            backgroundImage: `url(${posts[0].image})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          className="h-52 md:h-[400px] flex align-middle my-4"
        >
          <div
            className="flex items-center justify-center max-w-44 max-h-44 md:max-w-72 md:max-h-80 bg-white 
            ml-7 md:ml-10 dark:bg-[rgb(16,23,42)]"
          >
            <div className="p-2">
              <h2 className="capitalize text-gray-400 text-sm">
                featured article
              </h2>
              <Link to={`/post/${posts[0].slug}`} className="font-bold text-xl md:text-3xl capitalize line-clamp-2">
                {posts[0].title}
              </Link>
              <p className="text-xs text-gray-400 mt-1">
                {fullNameDate(posts[0].createdAt)}
              </p>
              <div
                className="p-1 text-sm line-clamp-4 overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: insertPTag(posts[0].content),
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="font-bold text-2xl">Editor&apos;s Pick</h1>
              <div className="w-24 h-1 bg-black rounded-sm" />
            </div>
            {posts.slice(1, 4).map((post) => (
              <div
                key={post._id}
                className="flex items-center gap-3 md:gap-8 mx-auto md:mx-40"
              >
                <Link to={`/post/${post.slug}`} className="flex flex-1 justify-end">
                  <img
                    src={post.image}
                    alt="Image"
                    className="h-44 w-44 object-cover shadow-md"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <h3 className="capitalize text-gray-400 text-sm">
                    {post.category}
                  </h3>
                  <Link to={`/post/${post.slug}`} className="font-semibold text-xl md:text-2xl capitalize line-clamp-2">
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">
                    {fullNameDate(post.createdAt)}
                  </p>
                  <div
                    className="text-sm line-clamp-4 overflow-hidden p-1"
                    dangerouslySetInnerHTML={{
                      __html: insertPTag(post.content),
                    }}
                  />
                </div>
              </div>
            ))}
            <Link
              to={'/search'}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div
          style={{
            backgroundImage: `url(${posts[4].image})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          className="h-52 md:h-[440px] flex align-middle my-4 relative"
        >
          <div
            className="flex items-center justify-center max-w-44 max-h-44 md:max-w-72 md:max-h-96 bg-white 
            dark:bg-[rgb(16,23,42)] absolute top-8 right-16 transform shadow-md"
          >
            <div className="p-2">
              <h2 className="capitalize text-gray-400 text-sm">
                {posts[4].category}
              </h2>
              <Link to={`/post/${posts[4].slug}`} className="font-bold text-xl md:text-2xl capitalize line-clamp-1">
                {posts[4].title}
              </Link>
              <p className="text-xs text-gray-400 mt-1">
                {fullNameDate(posts[4].createdAt)}
              </p>
              <div
                className="p-1 text-sm line-clamp-3 md:line-clamp-4 overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: insertPTag(posts[4].content),
                }}
              />
            </div>
          </div>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="flex w-full my-16 mx-auto md:gap-5 ">
          <div className="flex flex-col mx-auto max-w-5xl p-1 gap-6">
            {posts.slice(5, 9).map((post) => (
              <div
                key={post._id}
                className="flex items-center gap-3 md:gap-8 md:mx-14"
              >
                <Link to={`/post/${post.slug}`} className="flex justify-end">
                  <img
                    src={post.image}
                    alt=""
                    className="h-32 w-32 object-cover shadow-md"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-2">
                  <h3 className="capitalize text-gray-400 text-sm">
                    {post.category}
                  </h3>
                  <Link to={`/post/${post.slug}`} className="font-semibold text-lg md:text-xl capitalize line-clamp-2">
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">
                    {fullNameDate(post.createdAt)}
                  </p>
                  <div
                    className="text-sm line-clamp-4 overflow-hidden p-1"
                    dangerouslySetInnerHTML={{
                      __html: insertPTag(post.content),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
