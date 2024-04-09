// export interface IMessage {
//     id
//     message: string,
//     username: string,
//     user_id: string
// }

type id = string
export type requestType = 'addFriend' | 'acceptFriend' | 'rejectFriend' | 'removeFriend'
export type requestStatus = 'pending' | 'accepted' | 'rejected'

export interface IMessage {
    id: id,
    message: string,
    chat_id:id,
    sender_id: id,
    created_at?: string,

}

export interface IConservation {
    id: id,
    created_at?: string,
    admin?:id,
    name?: string,
    avatar?:string,
    members:id[]
}




export interface IChat {
    id: id,
    created_at?: string,
    name: string,
    avatar?:string,
    admin_id?:id,
    members?:id[]
}



export interface IUser {
    name: string,
    email:string,
    id:id,
    avatar?:string,
    last_activity?: Date,
    online_status?: boolean,
    birthdate?:string,
    age?:number,
    friends?:id[]
}

export interface RegisterPayload {
    name: string,
    email: string,
    password: string
    
}

export interface LoginPayload {
    email: string,
    password: string
}

