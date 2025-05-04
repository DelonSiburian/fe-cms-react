import { useState, useEffect } from "react";
import axios from "../utils/AxiosInstance";
import { useAuth } from "../utils/AuthProvider";

interface UserProfile {
  username: string;
  email: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getToken } = useAuth();

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      setError("Anda harus login");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setLoading(false);
    } catch {
      setError("Gagal mengambil data profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Memuat profil...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <h1 className="text-2xl font-bold mb-4 border-b-4 border-black pb-2">Profil Pengguna</h1>
      <div className="mb-3">
        <strong>Username:</strong> {profile?.username}
      </div>
      <div className="mb-3">
        <strong>Email:</strong> {profile?.email}
      </div>
      <div className="mb-3">
        <strong>Bio:</strong> {profile?.bio || "-"}
      </div>
      <div className="mb-3">
        <strong>Dibuat pada:</strong> {new Date(profile?.created_at || "").toLocaleString()}
      </div>
      <div className="mb-3">
        <strong>Terakhir diperbarui:</strong> {new Date(profile?.updated_at || "").toLocaleString()}
      </div>
    </div>
  );
};

export default Profile;
