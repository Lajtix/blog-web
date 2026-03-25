import {useEffect, useRef, useState} from "react";
import {PawPrint} from "lucide-react";

export const PostCard = ({ post, user, setSelectedPost, likePost, deletePost }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // useEffect se spustí AŽ POTÉ, co je post na obrazovce
    useEffect(() => {
        if (textRef.current) {
            const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsTruncated(hasOverflow);
        }
    }, [post.content]);

    const isLiked = post.like.some(like => like.userId === user?.id);

    return (
        <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 flex flex-col">
            <div className="justify-between flex items-center">
                <p className="text-blue-700 font-bold ">{post.author.username}</p>

                <div className="mt-auto">
                    {user && user.id === post.authorId && (
                        <button type="delete" onClick={() => setShowDeleteConfirm(true)}
                                className=" text-slate-500 hover:text-red-500  px-2 rounded-lg transition-all duration-200 font-bold text-sm cursor-pointer">
                            Delete Post
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-bold text-slate-900 text-left ">{post.title}</h2>
                <div className="">
                    <p ref={textRef} className="text-slate-600 mt-2 line-clamp-4">{post.content}</p>
                </div>
                <div className="flex flex-row">
                    {isTruncated && (
                        <button onClick={() => setSelectedPost(post)} className="text-blue-600 font-bold rounded-lg mt-4 flex hover:text-blue-800">Read more..</button>
                    )}
                    <div className="flex ml-auto">



                    </div>
                </div>
                { post.image && (
                    <img src={post.image} alt="Post Image" className="w-full h-60 object-cover mt-4 rounded-lg"/>
                    )}
                <div className="flex items-center justify-end mt-4">
                    <button onClick={() => likePost(post.id)}
                            className="flex items-center text-right justify-end mr-2 ml-auto transition">
                        <PawPrint
                            // This is where the magic happens:
                            size={20}
                            className={`transition-all duration-300 cursor-pointer ${
                                isLiked
                                    ? 'fill-orange-500 text-orange-500 scale-110' // Filled and Orange
                                    : 'text-slate-300 group-hover:text-orange-300' // Just an outline
                            }`}
                        />
                    </button>
                    <div className="w-6">
                        <p className='ml-2'>{post.like.length}</p>
                    </div>
                </div>
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-100/80 z-50 backdrop-blur-xs">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this post?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-slate-300 rounded-lg">Cancel</button>
                            <button onClick={() => deletePost(post.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};