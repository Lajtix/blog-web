import {useEffect, useRef, useState} from "react";
import {PawPrint} from "lucide-react";

export const PostCard = ({ post, user, setSelectedPost, likePost, deletePost }) => {
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
        <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 flex flex-col">
            <div className="justify-between flex items-center">
                <p className="text-blue-700 font-bold ">{post.author.username}</p>

                <div className="mt-auto">
                    {user && user.id === post.authorId && (
                        <button type="delete" onClick={() => deletePost(post.id)}
                                className=" text-slate-500 hover:text-red-500  px-2 rounded-lg transition-all duration-200 font-bold text-sm">
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
                    </div>
                </div>
                { post.image && (
                    <img src={post.image} alt="Post Image" className="w-full h-60 object-cover"/>
                    )}
            </div>
        </div>
    );
};