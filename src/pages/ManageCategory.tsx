import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ 
    name: '', 
    description: '' 
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { getToken } = useAuth();
 // Fetch Categories
 const fetchCategories = async () => {
    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoriesData = Array.isArray(response.data)
        ? response.data
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat kategori");
      setLoading(false);
    }
  };

  // Create Category
  const createCategory = async () => {
    const token = getToken();
    try {
      await axios.post("/api/categories", newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      setError("Gagal membuat kategori");
    }
  };

  // Update Category
  const updateCategory = async (id: number) => {
    const token = getToken();
    try {
      await axios.patch(`/api/categories/${id}`, editingCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError("Gagal update kategori");
    }
  };

  // Delete Category
  const deleteCategory = async (id: number) => {
    const token = getToken();
    try {
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      setError("Gagal menghapus kategori");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Memuat...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      {/* Container Form Tambah Kategori */}
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-6">
        <h2 className="text-xl font-bold mb-4 bg-black text-white p-3">
            Tambah Kategori Baru
        </h2>
        
        {/* Row untuk Nama Kategori */}
        <div className="p-4">
            <label className="block text-sm font-bold text-black mb-2">
            Nama Kategori
            </label>
            <input
            type="text"
            value={newCategory.name || ''}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Masukkan nama kategori"
            className="w-full p-3 border-4 border-black rounded-none bg-white 
                focus:outline-none focus:ring-0 focus:border-blue-600
                transition-all duration-300 
                hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            />
        </div>

        {/* Row untuk Deskripsi Kategori */}
        <div className="p-4">
            <label className="block text-sm font-bold text-black mb-2">
            Deskripsi Kategori (Opsional)
            </label>
            <textarea
            value={newCategory.description || ''}
            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Masukkan deskripsi kategori"
            className="w-full p-3 border-4 border-black rounded-none bg-white 
                focus:outline-none focus:ring-0 focus:border-blue-600
                transition-all duration-300
                hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            rows={3}
            />
        </div>

        {/* Row untuk Tombol Tambah */}
        <div className="p-4">
            <button
            onClick={createCategory}
            className="w-full bg-yellow-300 text-black border-4 border-black rounded-none 
                font-bold py-3 
                hover:bg-yellow-400 
                active:bg-yellow-500
                transition-all duration-300
                hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]
                active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
            Tambah Kategori
            </button>
        </div>
        </div>

      {/* Tabel Kategori */}
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="min-w-full">
            <thead className="bg-yellow-300 border-b-4 border-black">
            <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">ID</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">Nama</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black border-r-4 border-black">Deskripsi</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {categories.map((category) => (
                <tr 
                key={category.id} 
                className="border-b-4 border-black hover:bg-gray-100 
                    transition-all duration-300"
                >
                <td className="px-6 py-4 border-r-4 border-black">{category.id}</td>
                <td className="px-6 py-4 border-r-4 border-black">
                    {editingCategory?.id === category.id ? (
                    <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => 
                        setEditingCategory({ 
                            ...editingCategory, 
                            name: e.target.value 
                        })
                        }
                        className="w-full p-2 border-4 border-black rounded-none bg-white 
                        focus:outline-none focus:ring-0 focus:border-blue-600"
                    />
                    ) : (
                    category.name
                    )}
                </td>
                <td className="px-6 py-4 border-r-4 border-black">{category.slug}</td>
                <td className="px-6 py-4 border-r-4 border-black">
                    {editingCategory?.id === category.id ? (
                    <textarea
                        value={editingCategory.description || ''}
                        onChange={(e) => 
                        setEditingCategory({ 
                            ...editingCategory, 
                            description: e.target.value 
                        })
                        }
                        className="w-full p-2 border-4 border-black rounded-none bg-white 
                        focus:outline-none focus:ring-0 focus:border-blue-600"
                        rows={2}
                    />
                    ) : (
                    category.description || '-'
                    )}
                </td>
                <td className="px-6 py-4 space-x-2">
                    {editingCategory?.id === category.id ? (
                    <div className="flex space-x-2">
                        <button
                        onClick={() => updateCategory(category.id)}
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
                        onClick={() => setEditingCategory(null)}
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
                        onClick={() => setEditingCategory(category)}
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
                        onClick={() => deleteCategory(category.id)}
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

        {categories.length === 0 && (
        <div className="text-center py-4 text-black bg-yellow-300 border-4 border-black rounded-none 
            shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold">
            Tidak ada kategori
        </div>
        )}

    </div>
  );
};

export default ManageCategories;
