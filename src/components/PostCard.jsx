import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            {post.image && (
                <div className="relative h-56 overflow-hidden group">
                    <img
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        src={post.image}
                        alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                            {post.author.username[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {post.author.username}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Unknown Date'}
                    </span>
                </div>

                <Link to={`/posts/${post._id}`} className="block group mb-4 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2 line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                        {post.content}
                    </p>
                </Link>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{post.likes.length}</span>
                    </div>
                    <Link
                        to={`/posts/${post._id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center group"
                    >
                        Read more
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
