1||'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from "@/components/ui/use-toast";
import { FiUser, FiMail, FiLock, FiPhone, FiCamera, FiLogOut, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import cookies from '@/lib/cookies';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phoneNumber: '',
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '', // Assuming phoneNumber exists on user object
        }));
        setPreviewUrl(user.profilePictureUrl || '/placeholder-user.jpg'); // Assuming profilePictureUrl exists
        setLoading(false);
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Las nuevas contraseñas no coinciden." });
      return;
    }
    setSaving(true);

    try {
      const token = cookies.get('token');
      const updateData = new FormData(); // Use FormData for file uploads

      updateData.append('name', formData.name);
      updateData.append('phoneNumber', formData.phoneNumber);

      if (formData.newPassword && formData.currentPassword) {
        updateData.append('currentPassword', formData.currentPassword);
        updateData.append('newPassword', formData.newPassword);
      } else if (formData.newPassword && !formData.currentPassword) {
        toast({ variant: "destructive", title: "Error", description: "Por favor, introduce tu contraseña actual para cambiarla." });
        setSaving(false);
        return;
      }

      if (formData.profilePicture) {
        updateData.append('profilePicture', formData.profilePicture);
      }

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/profile', { 
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type is automatically set by browser when using FormData
        },
        body: updateData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el perfil');
      }

      toast({ title: "Éxito", description: "Perfil actualizado correctamente." });
      // Optionally update user context or refetch user data
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '', profilePicture: null }));

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>; // Basic loading state
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestionar Perfil</CardTitle>
          <CardDescription>Actualiza tu información personal y contraseña.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              <div className="relative">
                <Button type="button" variant="outline" size="sm" className="relative">
                  <FiCamera className="mr-2 h-4 w-4" /> Cambiar Foto
                  <Input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center"><FiUser className="mr-2" /> Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><FiMail className="mr-2" /> Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center"><FiPhone className="mr-2" /> Número de Teléfono (Opcional)</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="Ej: +1234567890" />
            </div>

            {/* Change Password Section */}
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="flex items-center"><FiLock className="mr-2" /> Contraseña Actual</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Deja en blanco si no cambias contraseña" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center"><FiLock className="mr-2" /> Nueva Contraseña</Label>
                <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Mínimo 8 caracteres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center"><FiLock className="mr-2" /> Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t dark:border-gray-700">
            <Button type="button" variant="destructive" onClick={logout} className="flex items-center">
              <FiLogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
            <Button type="submit" disabled={saving} className="flex items-center">
              {saving ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <FiSave className="mr-2 h-4 w-4" />}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}