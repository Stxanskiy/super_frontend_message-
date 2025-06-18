import { useQuery } from '@tanstack/react-query';
import { contactsService, Contact } from '@/lib/contacts-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_STRINGS } from '@/constants/strings';

export const ContactsList = () => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsService.getFriends,
  });

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