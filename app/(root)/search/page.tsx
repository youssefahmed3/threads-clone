import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import ProfileHeader from '@/components/shared/ProfileHeader';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { profileTabs } from '@/constants';
import Image from "next/image"
import ThreadsTab from '@/components/shared/ThreadsTab';
import UserCard from '@/components/cards/UserCard';

async function page() {
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) return redirect('/onboarding')

    const result = await fetchUsers(
        {
            userId: user.id,
            pageNumber: 1,
            pageSize: 20,
            searchString: "",
            
        }

    )
    return (
        <section>
            <h1 className='mb-10 head-text'>Search</h1>

            {/* Search Bar */}

            <div className='mt-14 flex flex-col gap-9'>
                {
                    result.users.length === 0 ? 
                    (
                        <p className='no-result'>No Users</p>
                    ) : (
                        <>
                            {result.users.map((person) => (
                                <UserCard 
                                    key={person.id}
                                    id={person.id}
                                    imgUrl={person.image}
                                    name={person.name} 
                                    personType='User'
                                    username={person.username}
                                />
                            ))}
                        </>
                    )
                }

            </div>
        </section>
    );
}

export default page;