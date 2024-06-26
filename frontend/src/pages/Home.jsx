import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/post";
import {
    useLikePostMutation,
    useSavePostMutation,
    useUnLikePostMutation,
    useUnsavePostMutation,
} from "../mutation/post";
import useAuthStore from "../store/useAuth";
import PostUserInfo from "../components/PostUserInfo";
import PostReaction from "../components/PostReaction";
import PostModal from "../components/PostModal";
import useThemeStore from "../store/useTheme";
import useClickedPostStore from "../store/useClickedPost";

const Home = () => {
    const { token, user, setUser } = useAuthStore();
    const { clickedHomePost, setClickHomePost } = useClickedPostStore();
    const { theme } = useThemeStore();

    const likePostMutation = useLikePostMutation();
    const unlikePostMutation = useUnLikePostMutation();
    const savePostMutation = useSavePostMutation();
    const unsavePostMutation = useUnsavePostMutation();

    const {
        data: posts,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["posts", token],
        queryFn: () => getPosts(token),
        enabled: !!token && user !== null,
    });

    const handleClick = (post) => {
        setClickHomePost(post);
        document.getElementById("post_modal").showModal();
    };

    const handleLike = (postId, isLiked) => {
        if (isLiked) {
            unlikePostMutation.mutate({ postId, token });
        } else {
            likePostMutation.mutate({ postId, token });
        }
    };

    const handleSavePost = (postId, isSaved) => {
        if (isSaved) {
            unsavePostMutation.mutate({ postId, token }, {
                onSuccess: (data) => {
                    setUser(data);
                }
            });
        } else {
            savePostMutation.mutate({ postId, token }, {
                onSuccess: (data) => {
                    setUser(data);
                }
            });
        }
    };

    return (
        <div className="w-screen px-5 flex flex-col items-center gap-5 pb-10 md:px-10 md:py-7 xl:flex xl:justify-between xl:gap-5 xl:py-0 xl:w-[99%] xl:mx-auto">
            {/* POST CARD */}
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Error: {error.message}</p>
            ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className={`w-80 p-3  rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${
                            theme === "dark" ? "bg-customGray" : "bg-slate-100"
                        }`}
                    >
                        {/* USER INFO */}
                        <PostUserInfo post={post} user={user} />
                        {/* PICTURE SECTION */}
                        <img
                            src={post.postPicture}
                            alt="post photo"
                            className={`xl:max-h-[500px] object-contain rounded-md ${
                                theme === "dark"
                                    ? "bg-customBlack"
                                    : "bg-slate-200"
                            }`}
                        />
                        {/* REACTION SECTION */}
                        <PostReaction
                            post={post}
                            handleClick={handleClick}
                            handleLike={handleLike}
                            handleSavePost={handleSavePost}
                        />

                        {/* POST DESCRIPTION SECTION */}
                        <div className="text-sm p-2 line-clamp-1">
                            {post.postContent}
                        </div>
                        <p
                            onClick={() => handleClick(post)}
                            className="p-2 text-sm text-slate-300 hover:underline cursor-pointer"
                        >
                            view all comments
                        </p>

                        {/* POST MODAL */}
                        <PostModal
                            clickedPost={clickedHomePost}
                            setClickedPost={setClickHomePost}
                            handleLike={handleLike}
                            handleSavePost={handleSavePost}
                        />
                    </div>
                ))
            ) : (
                <p>No posts</p>
            )}
        </div>
    );
};

export default Home;
