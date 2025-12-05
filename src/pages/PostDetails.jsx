import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

const PostDetails = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/${id}`);
                setPost(res.data);
                setLoading(false);
            } catch (err) {
                setError('Post not found');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async () => {
        try {
            const res = await api.put(`/posts/like/${id}`);
            setPost({ ...post, likes: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                console.log('Token for delete:', token);
                console.log('Deleting post ID:', id);

                await api.delete(`/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Delete successful');
                navigate('/');
            } catch (err) {
                console.error('Delete failed:', err);
                alert(err.response?.data?.message || 'Failed to delete post');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {post.image && (
                        <div className="w-full h-[400px] relative bg-gray-100">
                            <img
                                className="w-full h-full object-contain bg-gray-900"
                                src={post.image}
                                alt={post.title}
                            />
                        </div>
                    )}

                    <div className="px-8 py-10 sm:px-12">
                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase ring-2 ring-white">
                                            {post.author.username[0]}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-semibold text-gray-900">{post.author.username}</p>
                                            <p className="text-xs text-gray-500">Author</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : 'Unknown Date'}
                                        </p>
                                        <p className="text-xs text-gray-500">Published</p>
                                    </div>
                                </div>

                                {user && user.id === post.author._id && (
                                    <button
                                        onClick={handleDelete}
                                        className="text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 hover:border-red-600 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Post
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed">
                            {post.content.split('\n').map((paragraph, idx) => (
                                paragraph ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100">
                        <button
                            onClick={handleLike}
                            disabled={!user}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 shadow-sm border ${user
                                ? 'bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600'
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <svg
                                className={`h-6 w-6 transition-colors duration-200 ${post.likes.includes(user?.id)
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400'
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-semibold text-lg">{post.likes.length}</span>
                            <span className="font-medium">Likes</span>
                        </button>
                        {!user && <p className="text-sm text-gray-500 mt-2 ml-1">Login to like this post.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
