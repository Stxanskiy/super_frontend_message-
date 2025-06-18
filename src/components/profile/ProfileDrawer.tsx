import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { userService, UserProfile, UpdateProfileData } from "@/lib/user-service";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Save } from "lucide-react";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    about: '',
    phone: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      
      const userProfile = await userService.getProfile(userId);
      setProfile(userProfile);
      setFormData({
        about: userProfile.about || '',
        phone: userProfile.phone || '',
        avatarUrl: userProfile.avatarUrl || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Профиль</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : profile ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Никнейм</label>
                  <Input value={profile.nickname} disabled />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={profile.email} disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">О себе</label>
                  <Textarea
                    value={formData.about}
                    onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                    placeholder="Расскажите о себе"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">URL аватара</label>
                  <Input
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Сохранить
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Не удалось загрузить профиль
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 