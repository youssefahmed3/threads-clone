"use server"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDb } from "../mongoose"


interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function CreateThread({ text, author, communityId, path }: Params) {
    try {
        connectToDb()
        const createdThread = await Thread.create({
            text,
            author,
            community: null, // We Will implement later
            path
        })

        // updating the user threads

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);

        

    } catch (error: any) {
        console.log(`Failed Creating the Thread ${error.message}`);

    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;
    // to get the top level only
    const postsQuery = Thread.find({parentId: {$in : [null, undefined] }})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }

    })

    const totalPostsCount = await Thread.countDocuments({ parentId: {$in : [null, undefined]}})

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;
    
    return {posts, isNext}
}

export async function fetchThreadById(id: string) {
    connectToDb()

    try {
        const thread = await Thread.findById(id)
            .populate(
                {
                    path: "author",
                    model: User,
                    select: "_id id name image"
                })
                .populate({
                    path:"children",
                    populate: [
                        {
                            path: "author",
                            model: User,
                            select: "_id id name parentId image"
                        },
                        {
                            path: "children",
                            model: Thread,
                            populate: {
                                path: "author",
                                model: User,
                                select: "_id id name parentId image"
                            }
                        }
                    ]
                }).exec()

                return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDb()

    try {
        const originalThread = await Thread.findById(threadId)

        if(!originalThread){
            throw new Error(`Thread Not Found`)
        }

        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId: threadId
        })

        const savedCommentThread = await commentThread.save()

        await originalThread.children.push(savedCommentThread._id)

        await originalThread.save();

        revalidatePath(path)

    } catch (error:any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

