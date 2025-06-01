import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { APP_STRINGS } from '@/constants/strings';

interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  about?: string;
  phone?: string;
  avatar_url?: string;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/getByID');
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await apiClient.put('/users/profile/update', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: APP_STRINGS.PROFILE_UPDATED,
        description: APP_STRINGS.PROFILE_UPDATE_SUCCESS,
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: APP_STRINGS.PROFILE_UPDATE_ERROR,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{APP_STRINGS.PROFILE_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{APP_STRINGS.NICKNAME}</h3>
                <p>{profile?.nickname}</p>
              </div>
              <div>
                <h3 className="font-semibold">{APP_STRINGS.EMAIL}</h3>
                <p>{profile?.email}</p>
              </div>
              {profile?.about && (
                <div>
                  <h3 className="font-semibold">{APP_STRINGS.ABOUT}</h3>
                  <p>{profile.about}</p>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <h3 className="font-semibold">{APP_STRINGS.PHONE}</h3>
                  <p>{profile.phone}</p>
                </div>
              )}
              <Button onClick={handleEdit}>{APP_STRINGS.EDIT_PROFILE}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{APP_STRINGS.ABOUT}</h3>
                <Textarea
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder={APP_STRINGS.TELL_ABOUT_YOURSELF}
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{APP_STRINGS.PHONE}</h3>
                <Input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={APP_STRINGS.PHONE_PLACEHOLDER}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>{APP_STRINGS.SAVE}</Button>
                <Button variant="outline" onClick={handleCancel}>
                  {APP_STRINGS.CANCEL}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 