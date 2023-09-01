import * as z from 'zod'

export const ThreadValidation = z.object(
    {
        thread: z.string().min(10, {message: "Minimum 3 characters"}).max(1000).nonempty(),
        accountId: z.string().nonempty(),
    }
)

export const CommentValidation = z.object(
    {
        thread: z.string().min(3, {message: "Minimum 3 characters"}).max(1000).nonempty(),
        /* accountId: z.string().nonempty(), */
    }
)