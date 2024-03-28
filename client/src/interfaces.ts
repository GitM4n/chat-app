// export interface IMessage {
//     id
//     message: string,
//     username: string,
//     user_id: string
// }

type id = string

export interface IMessage {
    id: id,
    message: string,
    chat_id:id,
    sender_id: id,
    created_at?: string,

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
    friends?:IUser[]
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

