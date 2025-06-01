import { useQuery } from '@tanstack/react-query';
import { contactsService, Contact } from '@/lib/contacts-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';

export const ContactsList = () => {
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsService.getFriends,
  });

  const handleRemoveContact = async (contactId: string) => {
    try {
      await contactsService.rejectFriendRequest(contactId);
      toast({
        title: APP_STRINGS.CONTACT_REMOVED,
        description: APP_STRINGS.CONTACT_REMOVED_SUCCESS,
      });
    } catch (error) {
      toast({
        title: APP_STRINGS.ERROR,
        description: APP_STRINGS.CONTACT_REMOVE_ERROR,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{APP_STRINGS.CONTACTS}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts?.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{contact.nickname}</h3>
                {contact.about && (
                  <p className="text-sm text-muted-foreground">{contact.about}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveContact(contact.id)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {contacts?.length === 0 && (
            <p className="text-center text-muted-foreground">
              {APP_STRINGS.NO_CONTACTS}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 