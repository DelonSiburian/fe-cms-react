import { useState, useEffect } from "react";
import axios from "../utils/AxiosInstance";
import { useAuth } from "../utils/AuthProvider";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
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

const ManagePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    categoryId: 0,
    tagIds: [] as number[],
  });

  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const { getToken } = useAuth();

  const fetchPosts = async () => {
    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/api/post", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = Array.isArray(response.data)
        ? response.data
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setPosts(postsData);
      setLoading(false);
    } catch {
      setError("Gagal memuat posts");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catData = Array.isArray(res.data)
        ? res.data
        : res.data.data && Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setCategories(catData);
    } catch {
      // ignore error
    }
  };

  const fetchTags = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get("/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tagData = Array.isArray(res.data)
        ? res.data
        : res.data.data && Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setAllTags(tagData);
    } catch {
      // ignore error
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, []);

  const handleEditClick = (post: Post) => {
    setPostForm({
      title: post.title,
      content: post.content,
      imageUrl: post.image_url,
      categoryId: post.category.id,
      tagIds: post.tags.map((tag) => tag.id),
    });
    setEditingPostId(post.id);
    setError("");
  };

  const handleCancel = () => {
    setPostForm({
      title: "",
      content: "",
      imageUrl: "",
      categoryId: 0,
      tagIds: [],
    });
    setEditingPostId(null);
    setError("");
  };

  const handleSubmit = async () => {
    const { title, content, categoryId } = postForm;
    if (!title || !content || !categoryId) {
      setError("Judul, konten, dan kategori harus diisi");
      return;
    }
    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      return;
    }
    try {
      if (editingPostId === null) {
        await axios.post(
          "/api/post",
          postForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.put(
          `/api/post/${editingPostId}`,
          postForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      handleCancel();
      fetchPosts();
      setError("");
    } catch {
      setError(editingPostId === null ? "Gagal menambahkan post" : "Gagal memperbarui post");
    }
  };

  const handleDeleteClick = async (postId: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus post ini?");
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      return;
    }
    try {
      await axios.delete(`/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {
      setError("Gagal menghapus post");
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>

      {/* Form tambah/edit */}
      <div className="mb-8 bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 mx-auto">
        <h2 className="text-xl font-bold mb-4 bg-black text-white p-3 text-center">
          {editingPostId === null ? "Tambah Post Baru" : `Edit Post ID #${editingPostId}`}
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Judul"
            value={postForm.title}
            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
            className="w-full p-3 border-4 border-black rounded-none focus:outline-none"
          />
          <textarea
            placeholder="Konten"
            value={postForm.content}
            onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
            className="w-full p-3 border-4 border-black rounded-none focus:outline-none"
            rows={5}
          />
          <input
            type="text"
            placeholder="URL Gambar"
            value={postForm.imageUrl}
            onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
            className="w-full p-3 border-4 border-black rounded-none focus:outline-none"
          />
          <select
            value={postForm.categoryId}
            onChange={(e) => setPostForm({ ...postForm, categoryId: Number(e.target.value) })}
            className="w-full p-3 border-4 border-black rounded-none focus:outline-none"
          >
            <option value={0}>Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div>
            <label className="block mb-2 font-semibold">
              Tags (Ctrl+klik untuk pilih banyak):
            </label>
            <select
              multiple
              value={postForm.tagIds.map(String)}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (opt) => Number(opt.value)
                );
                setPostForm({ ...postForm, tagIds: selectedOptions });
              }}
              className="w-full p-3 border-4 border-black rounded-none focus:outline-none h-32"
            >
              {allTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-yellow-300 text-black border-4 border-black rounded-none font-bold px-6 py-3
                hover:bg-yellow-400 active:bg-yellow-500 transition-all duration-300
                hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              {editingPostId === null ? "Tambah Post" : "Simpan Perubahan"}
            </button>
            {editingPostId !== null && (
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-400 text-black border-4 border-black rounded-none font-bold px-6 py-3
                  hover:bg-gray-500 transition-all duration-300"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabel posts */}
      <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="min-w-full table-auto border-collapse border border-black">
          <thead className="bg-yellow-300 border-b-4 border-black">
            <tr>
              <th className="px-4 py-2 border border-black">ID</th>
              <th className="px-4 py-2 border border-black">Judul</th>
              <th className="px-4 py-2 border border-black">Kategori</th>
              <th className="px-4 py-2 border border-black">Tags</th>
              <th className="px-4 py-2 border border-black">Gambar</th>
              <th className="px-4 py-2 border border-black">Tanggal Dibuat</th>
              <th className="px-4 py-2 border border-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border border-black hover:bg-gray-100 transition-all duration-300"
              >
                <td className="px-4 py-2 border border-black">{post.id}</td>
                <td className="px-4 py-2 border border-black">{post.title}</td>
                <td className="px-4 py-2 border border-black">{post.category?.name}</td>
                <td className="px-4 py-2 border border-black">
                  {post.tags.map((tag) => tag.name).join(", ")}
                </td>
                <td className="px-4 py-2 border border-black">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-20 h-auto" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 border border-black">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-black space-x-2">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-black bg-yellow-300 border border-black font-bold"
                >
                  Tidak ada post
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePosts;
