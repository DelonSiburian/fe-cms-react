import { useNavigate } from 'react-router-dom';  

const ManageContent = () => {  
  const navigate = useNavigate();  

  const handleTagClick = () => {  
    navigate('/manage-content/tags');  
  };  
  const handleCategoryClick = () => {  
    navigate('/manage-content/categories');  
  };  
  const handlePostClick = () => {  
    navigate('/manage-content/posts');  
  };  
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-black">Manage Content</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <button
              onClick={handlePostClick} 
              className="
                bg-yellow-300 border-4 border-black 
                rounded-lg shadow-md 
                py-16 
                w-full
                text-center font-extrabold text-black 
                hover:bg-yellow-400 
                transition duration-300
                flex items-center justify-center
                text-2xl
                select-none
              "
            >
              Post
            </button>
            <p className="mt-3 text-sm text-gray-800 font-medium">
              Buat dan kelola postingan Anda
            </p>
          </div>
  
          <div className="text-center">
            <button
              onClick={handleCategoryClick} 
              className="
                bg-yellow-300 border-4 border-black 
                rounded-lg shadow-md 
                py-16
                w-full
                text-center font-extrabold text-black 
                hover:bg-yellow-400 
                transition duration-300
                flex items-center justify-center
                text-2xl
                select-none
              "
            >
              Category
            </button>
            <p className="mt-3 text-sm text-gray-800 font-medium">
              Tambah, edit, dan hapus kategori konten
            </p>
          </div>
  
          <div className="text-center">
            <button
              onClick={handleTagClick} 
              className="
                bg-yellow-300 border-4 border-black 
                rounded-lg shadow-md 
                py-16 
                w-full
                text-center font-extrabold text-black 
                hover:bg-yellow-400 
                transition duration-300
                flex items-center justify-center
                text-2xl
                select-none
              "
            >
              Tag
            </button>
            <p className="mt-3 text-sm text-gray-800 font-medium">
              Kelola tag untuk mengorganisir konten
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ManageContent;
  