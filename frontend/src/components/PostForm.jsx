import {useRef, useState} from "react";

export const PostForm = ({user, fetchPosts}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const fileInputRef = useRef(null);
    const[uploadedImage, setUploadedImage] = useState(null);

    const handleCancelImageUpload = () => {
        setUploadedImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

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

    return (
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
                    <div className="my-auto">
                        <label className="block flex-1 my-auto
                                   mr-4 py-2 px-4
                                   rounded-lg border-0
                                   text-sm font-bold
                                   bg-blue-50 text-blue-700
                                   hover:bg-blue-100 cursor-pointer"> Upload Image
                            <input placeholder="Upload an image" ref={fileInputRef} onChange={handleImageUpload} type="file" accept='image/*' className="
                                   hidden" />
                        </label>

                        <div>
                            {uploadedImage && (
                                <button onClick={handleCancelImageUpload} placeholder="Upload an image" className="rounded-lg bg-red-50 px-4 py-2 border-0 text-sm font-bold text-red-700 mt-4 hover:bg-red-100 cursor-pointer">Remove image</button>
                            )}
                        </div>
                    </div>
                    {uploadedImage && (
                        <img src={uploadedImage} alt="Post Image" className="w-100 h-48 object-cover ml-auto rounded-lg mb-4" />
                    )}

                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer">
                    Publish Post
                </button>
            </div>
        </form>
    )
}