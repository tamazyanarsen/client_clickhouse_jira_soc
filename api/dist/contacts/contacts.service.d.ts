import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Contact } from './contact.entity';
export declare class ContactsService {
    private contactRepository;
    constructor(contactRepository: Repository<Contact>);
    findAll(): Promise<Contact[]>;
    create(contact: Contact): Promise<Contact>;
    update(contact: Contact): Promise<UpdateResult>;
    delete(id: any): Promise<DeleteResult>;
}
