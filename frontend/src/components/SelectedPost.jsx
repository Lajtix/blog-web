import {PawPrint, X} from "lucide-react";
export const SelectedPost = ({selectedPost, user, setSelectedPost, likePost, deletePost, isSelectedLiked}) => {

    return (
    <div key={selectedPost.id} className="fixed inset-0 mx-auto rounded-xl shadow-sm border border-slate-400 z-50 backdrop-blur-xl bg-slate-300/50 ">
        <div className="bg-white/85 max-w-4xl max-h-[85vh] mt-16 mx-auto overflow-hidden flex flex-col rounded-2xl">
            <div className="relative">
                <button className="absolute top-4 right-4 bg-white/80 hover:bg-slate-100 text-slate-800 p-2 rounded-full shadow-md transition z-10" onClick={() => setSelectedPost(null)}>
                    <X size="20"/>
                </button>
            </div>
            <div className="overflow-y-auto px-6">
                <div className="relative">
                    {selectedPost.image && (
                    <img src={selectedPost.image} alt="Post Image" className="max-w-full h-64 rounded-lg mb-4 mx-auto"/>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{selectedPost.title}</h2>
                </div>

                <p className="text-slate-600 leading-relaxed text-lg">{selectedPost.content}</p>
            </div>

            <div className='items-center grid grid-cols-2 w-full bg-slate-100 pt-2 px-6 py-2'>
                <div className="flex justify-start">
                    {user && user.id === selectedPost.authorId && (
                        <button type="delete" onClick={() => deletePost(selectedPost.id)}
                                className=" text-red-500 font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                            Delete Post
                        </button>
                    )}
                </div>
                <div className="flex justify-end">
                    <button onClick={() => likePost(selectedPost.id)}
                            className="flex items-center text-right justify-end mr-12 ml-auto transition">
                        <PawPrint
                            size={24}
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
                    <p className="w-8 h-8  text-blue-600 flex items-center justify-center font-bold">{selectedPost.author.username}</p>
                </div>
            </div>
        </div>
    </div>
    );
};


