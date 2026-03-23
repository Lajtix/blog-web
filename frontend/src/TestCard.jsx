import { PawPrint } from "lucide-react";

export default function TestCard () {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 flex flex-col gap-4 hover:shadow-md transition-shadow">

            {/* 1. HEADER: Author Info & Delete Button */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                        F
                    </div>
                    <p className="font-bold text-slate-700">FoxFan99</p>
                </div>

                {/* Delete button (Forced visible for preview) */}
                <button className="text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
                    Delete
                </button>
            </div>

            {/* 2. BODY: Title, Content, and Read More */}
            <div className="flex flex-col">
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">The Secret Life of Foxes in the Woods</h2>

                {/* Text is long enough to hit the line-clamp-4 limit */}
                <p className="text-slate-600 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    Foxes are small to medium-sized, omnivorous mammals belonging to several genera of the family Canidae. They have a flattened skull, upright triangular ears, a pointed, slightly upturned snout, and a long bushy tail.

                    This is a second paragraph just to test how the line clamp works. When you have a really long post, it will smoothly cut off right here with an ellipsis...
                </p>

                {/* Read more button (Forced visible) */}
                <button className="text-blue-600 font-bold mt-2 self-start hover:underline">
                    Read more
                </button>
            </div>

            {/* 3. IMAGE: Beautiful edge-to-edge rounded thumbnail */}
            <img
                src="https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1000&auto=format&fit=crop"
                alt="Post Image"
                className="w-full max-h-96 object-cover rounded-xl border border-slate-100 mt-2"
            />

            {/* 4. FOOTER: Likes */}
            <div className="flex justify-start items-center pt-4 border-t border-slate-100 mt-2">
                <button className="flex items-center gap-2 group transition">
                    <PawPrint
                        size={22}
                        // Forced into the "Liked" orange state for the preview
                        className="transition-transform duration-300 fill-orange-500 text-orange-500 scale-110"
                    />
                    <span className="font-bold text-lg text-orange-600">
                        42
                    </span>
                </button>
            </div>

        </div>
    );
};