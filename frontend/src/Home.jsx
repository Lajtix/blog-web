import {useState, useEffect, useRef, use} from 'react'
import {Routes, Route, Link} from 'react-router-dom'
import { PawPrint} from 'lucide-react';

const PostCard = ({ post, user, setSelectedPost, likePost, deletePost }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef(null);

    // useEffect se spustí AŽ POTÉ, co je post na obrazovce
    useEffect(() => {
        if (textRef.current) {
            const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsTruncated(hasOverflow);
        }
    }, [post.content]);

    const isLiked = post.like.some(like => like.userId === user?.id);

    return (
        <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 grid grid-cols-[auto_1fr_auto]">
            <div className="justify-start w-50 flex flex-col">
                { post.image && (
                    <img src={post.image} alt="Post Image" className="w-50 h-50 object-cover rounded-lg mb-4"/>
                )}
                <div className="mt-auto">
                    {user && user.id === post.authorId && (
                        <button type="delete" onClick={() => deletePost(post.id)}
                                className=" text-red-500 border-1 border-red-200 hover:bg-red-500 hover:text-white px-2 rounded-lg transition-all duration-200">
                            Delete Post
                        </button>
                    )}
                </div>
            </div>
            <div className="text-left ml-4 flex flex-col min-w-0">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-blue-600 text-left ">{post.title}</h2>
                    <div className="">
                        <p ref={textRef} className="text-slate-600 mt-2 line-clamp-6">{post.content}</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    {isTruncated && (
                        <button onClick={() => setSelectedPost(post)} className="text-blue-600 font-bold  px-2 rounded-lg justify-between items-center mt-6">Read more</button>
                    )}
                </div>
            </div>
            <div className="justify-end">
                <div className='items-center mt-52 justify-end'>


                    <div className="flex justify-end">
                        <button onClick={() => likePost(post.id)}
                                className="flex items-center text-right justify-end mr-8 ml-auto transition">
                            <PawPrint
                                // This is where the magic happens:
                                size={20}
                                className={`transition-all duration-300 ${
                                    isLiked
                                        ? 'fill-orange-500 text-orange-500 scale-110' // Filled and Orange
                                        : 'text-slate-300 group-hover:text-orange-300' // Just an outline
                                }`}
                            />
                            <div className="w-6">
                                <p className='ml-2'>{post.like.length}</p>
                            </div>
                        </button>
                        <p className="text-blue-600 justify-end text-right mr-4 w-12">{post.author.username}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home({user}) {

    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const LIMIT = 10;
    const [selectedPost, setSelectedPost] = useState(null);

    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef(null);

    const[uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {

    }, [setUploadedImage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleCancelImageUpload = () => {
        setUploadedImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

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
                const totalPosts = data.totalPosts;
                setTotalPosts(totalPosts);
                console.log("Auto-opening post:", data.posts[0]);
                console.log(selectedPost);
                setOffset(newOffset);})
            .catch(err => console.error("Error:", err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stops the page from refreshing
        try {
            if (!user) {
                alert("You have to be logged in order to create a post! 🦊");
                return;
            }
            const newPost = {title, content, authorId: user.id, image: uploadedImage};
            const response = await fetch('http://localhost:5003/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPost),
            });
            console.log(2)
            if (response.ok) {
                setTitle(''); // Clear the input
                setContent(''); // Clear the textarea
                handleCancelImageUpload();
                fetchPosts(); // Refresh the list to show the new post
            } else {
                alert("Failed to create post");
            }
        } catch (error) {
            console.error("Error:", error);
        }
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

            if(selectedPost.id === id) {
                setSelectedPost(null);
            }
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
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">Fox Blog 🦊</h1>

                {/* --- CREATE POST FORM --- */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10">
                    <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Post Title"
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} // Update state on every keystroke
                            required
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full p-2 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                            <div className='flex flex-row'>
                                <input ref={fileInputRef} onChange={handleImageUpload} type="file" accept='image/*' className="block flex-1 my-auto text-sm text-slate-500
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-lg file:border-0
                                   file:text-sm file:font-bold
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100 cursor-pointer"/>
                                {uploadedImage && (
                                <img src={uploadedImage} alt="Post Image" className="w-50 h-48 object-cover rounded-lg mb-4" />
                                )}
                            </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                            Publish Post
                        </button>
                    </div>
                </form>

                {/* --- POST LIST --- */}
                <div className="space-y-6 flex flex-col w-2xl">
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
                <div key={selectedPost.id} className="fixed inset-0 mx-auto bg-slate-100/30 max-w-2xl p-6 rounded-xl shadow-sm border border-slate-200 z-50 backdrop-blur-xl max-h[90vh] overflow-y-auto">
                    <img src={selectedPost.image} alt="Post Image" className="max-w-full max-h-50 rounded-lg mb-4 mx-auto"/>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-blue-600">{selectedPost.title}</h2>
                        <button onClick={() => setSelectedPost(null)} className="bg-red-500 px-1.5 rounded-lg">X</button>
                    </div>
                    <p className="text-slate-600 mt-2">{selectedPost.content}</p>
                    <div className='items-center grid grid-cols-2 mt-4'>
                    <div className="flex justify-start">
                        {user && user.id === selectedPost.authorId && (
                            <button type="delete" onClick={() => deletePost(selectedPost.id)}
                                    className=" text-red-500 border-1 border-red-200 hover:bg-red-500 hover:text-white px-2 rounded-lg transition-all duration-200">
                                Delete Post
                            </button>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => likePost(selectedPost.id)}
                                className="flex items-center text-right justify-end mr-8 ml-auto transition">
                            <PawPrint
                                size={20}
                                className={`transition-all duration-300 ${
                                    isSelectedLiked
                                        ? 'fill-orange-500 text-orange-500 scale-110' // Filled and Orange
                                        : 'text-slate-300 group-hover:text-orange-300' // Just an outline
                                }`}
                            />
                            <div className="w-6">
                                <p className='ml-2'>{selectedPost.like.length}</p>
                            </div>
                        </button>
                        <p className="text-blue-600 justify-end text-right mr-4 w-12">{selectedPost.author.username}</p>
                    </div>
                </div>
            </div>
    )}
        </div>
    )
}
