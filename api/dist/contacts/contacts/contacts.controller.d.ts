import { Contact } from '../contact.entity';
import { ContactsService } from '../contacts.service';
export declare class ContactsController {
    private contactsService;
    constructor(contactsService: ContactsService);
    index(): Promise<Contact[]>;
    create(contactData: Contact): Promise<any>;
    update(id: any, contactData: Contact): Promise<any>;
    delete(id: any): Promise<any>;
}
