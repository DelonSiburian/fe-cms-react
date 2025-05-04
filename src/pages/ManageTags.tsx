import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

const ManageTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState<Partial<Tag>>({ name: '' });
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { getToken } = useAuth();

  // Fetch Tags
  const fetchTags = async () => {
    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tagsData = Array.isArray(response.data)
        ? response.data
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setTags(tagsData);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat tags");
      setLoading(false);
    }
  };

  // Create Tag
  const createTag = async () => {
    const token = getToken();
    try {
      await axios.post("/api/tags", newTag, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTag({ name: '' });
      fetchTags();
    } catch (err) {
      setError("Gagal membuat tag");
    }
  };

  // Update Tag
  const updateTag = async (id: number) => {
    const token = getToken();
    try {
      await axios.patch(`/api/tags/${id}`, editingTag, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      setError("Gagal update tag");
    }
  };

  // Delete Tag
  const deleteTag = async (id: number) => {
    const token = getToken();
    try {
      await axios.delete(`/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTags();
    } catch (err) {
      setError("Gagal menghapus tag");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) return <div>Memuat...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tags</h1>
{/* Container Form Tambah Tag */}
<div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-6">
  <h2 className="text-xl font-bold mb-4 bg-black text-white p-3">
    Tambah Tag Baru
  </h2>
        {/* Form Tambah/Edit Tag */}
        <div className="p-4 flex space-x-4">
            <input
            type="text"
            value={newTag.name || ''}
            onChange={(e) => setNewTag({ name: e.target.value })}
            placeholder="Nama Tag Baru"
            className="flex-grow p-3 border-4 border-black rounded-none bg-white 
                focus:outline-none focus:ring-0 focus:border-blue-600
                transition-all duration-300 
                hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            />
            <button
            onClick={createTag}
            className="bg-yellow-300 text-black border-4 border-black rounded-none 
                font-bold px-6 py-3
                hover:bg-yellow-400 
                active:bg-yellow-500
                transition-all duration-300
                hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]
                active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
            Tambah Tag
            </button>
        </div>
        </div>

        {/* Tabel Tags */}
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="min-w-full">
            <thead className="bg-yellow-300 border-b-4 border-black">
            <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">ID</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">Nama</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {tags.map((tag) => (
                <tr 
                key={tag.id} 
                className="border-b-4 border-black hover:bg-gray-100 
                    transition-all duration-300"
                >
                <td className="px-6 py-4 border-r-4 border-black">{tag.id}</td>
                <td className="px-6 py-4 border-r-4 border-black">
                    {editingTag?.id === tag.id ? (
                    <input
                        type="text"
                        value={editingTag.name}
                        onChange={(e) => 
                        setEditingTag({ ...editingTag, name: e.target.value })
                        }
                        className="w-full p-2 border-4 border-black rounded-none bg-white 
                        focus:outline-none focus:ring-0 focus:border-blue-600"
                    />
                    ) : (
                    tag.name
                    )}
                </td>
                <td className="px-6 py-4 border-r-4 border-black">{tag.slug}</td>
                <td className="px-6 py-4 space-x-2">
                    {editingTag?.id === tag.id ? (
                    <div className="flex space-x-2">
                        <button
                        onClick={() => updateTag(tag.id)}
                        className="bg-green-300 text-black border-4 border-black rounded-none 
                            px-3 py-1 font-bold
                            hover:bg-green-400 
                            active:bg-green-500
                            transition-all duration-300
                            hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
                            active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        >
                        Simpan
                        </button>
                        <button
                        onClick={() => setEditingTag(null)}
                        className="bg-gray-300 text-black border-4 border-black rounded-none 
                            px-3 py-1 font-bold
                            hover:bg-gray-400 
                            active:bg-gray-500
                            transition-all duration-300
                            hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
                            active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        >
                        Batal
                        </button>
                    </div>
                    ) : (
                    <div className="flex space-x-2">
                        <button
                        onClick={() => setEditingTag(tag)}
                        className="bg-blue-300 text-black border-4 border-black rounded-none 
                            px-3 py-1 font-bold
                            hover:bg-blue-400 
                            active:bg-blue-500
                            transition-all duration-300
                            hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
                            active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => deleteTag(tag.id)}
                        className="bg-red-300 text-black border-4 border-black rounded-none 
                            px-3 py-1 font-bold
                            hover:bg-red-400 
                            active:bg-red-500
                            transition-all duration-300
                            hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
                            active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        >
                        Hapus
                        </button>
                    </div>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>

        {tags.length === 0 && (
        <div className="text-center py-4 text-black bg-yellow-300 border-4 border-black rounded-none 
            shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold">
            Tidak ada tags
        </div>
        )}

    </div>
  );
};

export default ManageTags;
