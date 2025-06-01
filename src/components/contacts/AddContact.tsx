import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsService } from '@/lib/contacts-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';
import { useDebounce } from '@/hooks/use-debounce';
import { useQuery } from '@tanstack/react-query';

export const AddContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', debouncedSearch],
    queryFn: () => contactsService.searchUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const sendRequestMutation = useMutation({
    mutationFn: contactsService.sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      toast({
        title: APP_STRINGS.FRIEND_REQUEST_SENT,
        description: APP_STRINGS.FRIEND_REQUEST_SENT_SUCCESS,
      });
      setSearchQuery('');
    },
    onError: () => {
      toast({
        title: APP_STRINGS.ERROR,
        description: APP_STRINGS.FRIEND_REQUEST_SEND_ERROR,
        variant: 'destructive',
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{APP_STRINGS.ADD_CONTACT}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder={APP_STRINGS.SEARCH_CONTACTS}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && <div>Searching...</div>}
          {searchResults && searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{user.nickname}</h3>
                    {user.about && (
                      <p className="text-sm text-muted-foreground">{user.about}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendRequestMutation.mutate(user.id)}
                  >
                    {APP_STRINGS.ADD_CONTACT}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {searchResults && searchResults.length === 0 && searchQuery && (
            <p className="text-center text-muted-foreground">
              {APP_STRINGS.NO_USERS_FOUND}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 