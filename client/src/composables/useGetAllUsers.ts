import {ref} from 'vue'
import { useUser } from './useUser.global'
import {supabase} from '@/supabaseClient'
import type {IUser, requestType, requestStatus} from '@/interfaces'

const user = useUser().userData

const allUsers = ref<IUser[] | null>()
const friends = ref<IUser[] | null>()


export const useGetAllUsers = () => {

    const getAllUsers = async() => {
        const {data} = await supabase.from('users').select().neq('id', user.value?.id)
        allUsers.value = data
    }


    const getFriends = async() => {
        const {data} = await supabase.from('users').select('friends').eq('id', user.value?.id)
        if(data![0].friends === null) return
        friends.value = allUsers.value?.filter(user => data![0].friends.includes(user.id))
    
    }

    const sendRequest = async(id: string, type:requestType) => {

        const {data:checkRequest, error:checkRequestError} = await supabase.from('requests')
                                            .select('request_name, sender_id')
                                            .eq('sender_id', user.value?.id)
                                            .eq('receiver_id', id)
                                            .eq('request_name', type)

        if(checkRequestError) console.log(checkRequestError)
        if(checkRequest!.length > 0){
            console.log(checkRequest![0])
            return
        }

        const {data, error} = await supabase.from('requests')
                                            .insert({
                                                request_name: type,
                                                sender_id: user.value?.id,
                                                receiver_id: id,
                                                request_status: 'pending'
                                            })
                                            .select()
        if(error) throw (error)
        console.log(data)
        return data
        
    }

    const acceptRequest = async(id: string, type:requestType) => {
        const {data, error} = await supabase.from('requests')
                                            .update({
                                                request_status: 'accepted'
                                            })
                                            .eq('sender_id', id)
                                            .eq('receiver_id', user.value?.id)
                                            .eq('request_name', type)
        if(error) throw (error)
        console.log(data)

       
    }

    const rejectRequest = async(id: string, type:requestType) => {
        const {data, error} = await supabase.from('requests')
                                            .delete()
                                            .eq('sender_id', id)
                                            .eq('receiver_id', user.value?.id)
                                            .eq('request_name', type)
        if(error) throw (error)
        console.log(data)


    }

    
   

    return {
        getAllUsers,
        allUsers,
        getFriends,
        friends,
        sendRequest,
        acceptRequest
    }
}