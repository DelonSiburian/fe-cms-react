import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  category: Category;
  tags: Tag[];
}

const Home = () => {  
  const [posts, setPosts] = useState<Post[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState("");  
  const { getToken } = useAuth();  

  useEffect(() => {  
    const fetchPosts = async () => {  
      const token = getToken();  
      if (!token) {  
        setError("Anda harus login untuk melihat postingan");  
        setLoading(false);  
        return;  
      }  

      try {  
        const response = await axios.get("/api/post", {  
          headers: {  
            Authorization: `Bearer ${token}`,  
          },  
        });  

        const postsData = Array.isArray(response.data)  
          ? response.data  
          : response.data.data && Array.isArray(response.data.data)  
          ? response.data.data  
          : [];  

        setPosts(postsData);  
      } catch {  
        setError("Gagal memuat postingan");  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchPosts();  
  }, [getToken]);  

  const truncateContent = (content: string, maxLength: number = 100): string => {  
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;  
  };  

  if (loading) return <div>Memuat...</div>;  
  if (error) return <div className="text-red-500">{error}</div>;  

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300"
            >
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-gray-400 text-xs mb-3">
                  Created at:{" "}
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 text-sm font-medium">
                      {post.category.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="text-gray-400 text-xs">
                        Tag : &nbsp;{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Belum ada postingan</div>
      )}
    </div>
  );
};

export default Home;
