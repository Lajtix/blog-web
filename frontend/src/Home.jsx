import {useState, useEffect, useRef, use} from 'react'
import {PostCard} from './components/PostCard';
import {SelectedPost} from "./components/SelectedPost";
import {PostForm} from "./components/PostForm";

export default function Home({user}) {

    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const LIMIT = 10;
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if(selectedPost) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedPost]);

    const fetchPosts = (isLoadMore = false) => {
        const newOffset = isLoadMore ? offset + LIMIT : 0;

        fetch(`http://localhost:5003/posts?limit=${LIMIT}&offset=${newOffset}`)
            .then(res => res.json())
            .then(data => {
                if (isLoadMore) {
                    // GLUE the new posts to the end of the old ones
                    setPosts(prev => [...prev, ...data.posts]);

                } else {
                    // Fresh start
                    setPosts(data.posts);
                }
                const totalPostsData = data.totalPosts;

                setTotalPosts(totalPostsData);
                console.log("total: " + totalPosts, posts.length)
                console.log("Auto-opening post:", data.posts[0]);
                console.log(selectedPost);
                setOffset(newOffset);})
            .catch(err => console.error("Error:", err));
    };

    const deletePost = async (id) => {
        const response = await fetch(`http://localhost:5003/posts/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
            }),
        })
        if(response.ok) {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            setTotalPosts(prevTotalPosts => prevTotalPosts - 1);
            if(selectedPost.id === id) {
                setSelectedPost(null);
            }
            fetchPosts(true);
        } else {
            alert("Failed to fetch Posts")
        }
    }
    const likePost = async (id) => {
        const response = await fetch(`http://localhost:5003/posts/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: id,
                userId: user.id,
            }),
        })
        const data = await response.json();
        console.log(data.post);
        if(response.ok) {
            const updatedPost = data.post;
            setPosts(prevPosts => prevPosts.map(post => post.id === id ? updatedPost : post));

            if(selectedPost.id === id) {
                setSelectedPost(prevPost => prevPost.id === id ? {...prevPost, like: updatedPost.like} : prevPost);
            }
            console.log(
                "Updated post:",
                updatedPost
            )
        } else {
            console.log(response.statusText)
            alert("Failed to fetch Posts")
        }
    }
    const isSelectedLiked = selectedPost?.like.some(like => like.userId === user?.id);
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">Fox Blog 🦊</h1>

                {/* --- CREATE POST FORM --- */}
                <PostForm
                    user={user}
                    fetchPosts={fetchPosts}
                />
                {/* --- POST LIST --- */}
                <div className="space-y-6 flex flex-col w-3xl">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            user={user}
                            setSelectedPost={setSelectedPost}
                            likePost={likePost}
                            deletePost={deletePost}
                        />
                    ))}
                    {totalPosts > posts.length &&
                        <button onClick={() => fetchPosts(true)} className="text-amber-500 hover:text-amber-700 mt-4 text-center font-bold text-xl">Load more..</button>
                    }
                </div>
            </div>
            {/* selectPost*/}
            {selectedPost && (
                <SelectedPost
                    key={selectedPost.id}
                    selectedPost={selectedPost}
                    user={user}
                    setSelectedPost={setSelectedPost}
                    likePost={likePost}
                    deletePost={deletePost}
                    isSelectedLiked={isSelectedLiked}
                />
            )}
        </div>
    )
}
