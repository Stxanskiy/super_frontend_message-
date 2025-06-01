import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactsList } from '@/components/contacts/ContactsList';
import { FriendRequests } from '@/components/contacts/FriendRequests';
import { AddContact } from '@/components/contacts/AddContact';
import { APP_STRINGS } from '@/constants/strings';

const ContactsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">{APP_STRINGS.CONTACTS}</TabsTrigger>
          <TabsTrigger value="requests">{APP_STRINGS.FRIEND_REQUESTS}</TabsTrigger>
          <TabsTrigger value="add">{APP_STRINGS.ADD_CONTACT}</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactsList />
        </TabsContent>
        <TabsContent value="requests">
          <FriendRequests />
        </TabsContent>
        <TabsContent value="add">
          <AddContact />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsPage; 