import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsService, FriendRequest } from '@/lib/contacts-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';

export const FriendRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: contactsService.getFriendRequests,
  });

  const acceptMutation = useMutation({
    mutationFn: contactsService.acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: APP_STRINGS.FRIEND_REQUEST_ACCEPTED,
        description: APP_STRINGS.FRIEND_REQUEST_ACCEPTED_SUCCESS,
      });
    },
    onError: () => {
      toast({
        title: APP_STRINGS.ERROR,
        description: APP_STRINGS.FRIEND_REQUEST_ACCEPT_ERROR,
        variant: 'destructive',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: contactsService.rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      toast({
        title: APP_STRINGS.FRIEND_REQUEST_REJECTED,
        description: APP_STRINGS.FRIEND_REQUEST_REJECTED_SUCCESS,
      });
    },
    onError: () => {
      toast({
        title: APP_STRINGS.ERROR,
        description: APP_STRINGS.FRIEND_REQUEST_REJECT_ERROR,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{APP_STRINGS.FRIEND_REQUESTS}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests?.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{request.sender.nickname}</h3>
                {request.sender.about && (
                  <p className="text-sm text-muted-foreground">
                    {request.sender.about}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => acceptMutation.mutate(request.sender.id)}
                >
                  {APP_STRINGS.ACCEPT}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectMutation.mutate(request.sender.id)}
                >
                  {APP_STRINGS.REJECT}
                </Button>
              </div>
            </div>
          ))}
          {requests?.length === 0 && (
            <p className="text-center text-muted-foreground">
              {APP_STRINGS.NO_FRIEND_REQUESTS}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 