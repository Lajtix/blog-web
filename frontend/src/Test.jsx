import { PawPrint, X } from "lucide-react";

export default function Test() {

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">

                {/* Close Button (Visual only) */}
                <button className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition z-10">
                    <X size={20} strokeWidth={3} />
                </button>

                <div className="overflow-y-auto w-full">

                    {/* Placeholder Hero Image */}
                    <img
                        src="https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1000&auto=format&fit=crop"
                        alt="Post Image"
                        className="w-full h-64 object-cover"
                    />

                    <div className="p-6 md:p-8">
                        {/* Placeholder Title */}
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                            The Secret Life of Foxes in the Woods
                        </h2>

                        {/* Placeholder Content */}
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                            Foxes are small to medium-sized, omnivorous mammals belonging to several genera of the family Canidae. They have a flattened skull, upright triangular ears, a pointed, slightly upturned snout, and a long bushy tail.

                            This is a second paragraph just to show how the spacing looks when someone writes a longer post. You should be able to scroll this text while the bottom buttons stay perfectly locked in place!
                            This is a second paragraph just to show how the spacing looks when someone writes a longer post. You should be able to scroll this text while the bottom buttons stay perfectly locked in place!
                            This is a second paragraph just to show how the spacing looks when someone writes a longer post. You should be able to scroll this text while the bottom buttons stay perfectly locked in place!

                            Bla bla idk asdinasidjasindioasjd aisdoaisjdiasd aoisdjoaisj doasnd oiasod aosd
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">

                    {/* Delete Button (Forced visible) */}
                    <div>
                        <button className="text-red-500 font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                            Delete Post
                        </button>
                    </div>

                    <div className="flex items-center gap-6">

                        {/* Like Button (Forced into "Liked" state for preview) */}
                        <button className="flex items-center gap-2 text-slate-500 transition group">
                            <PawPrint
                                size={24}
                                className="transition-transform duration-300 fill-orange-500 text-orange-500 scale-110"
                            />
                            <span className="font-bold text-lg">42</span>
                        </button>

                        <div className="w-px h-6 bg-slate-300"></div>

                        {/* Placeholder Author */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                F
                            </div>
                            <p className="text-slate-700 font-bold">FoxFan99</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};