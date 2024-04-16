import {ref} from 'vue'
import { useUser } from './useUser.global'
import {supabase} from '@/supabaseClient'
import type {IUser, requestType, IRequest} from '@/interfaces'

const user = useUser().userData

const allUsers = ref<IUser[] | null>()
const friends = ref<IUser[] | null>()


export const useGetAllUsers = () => {

    const getAllUsers = async() => {
        const {data} = await supabase.from('users').select().neq('id', user.value?.id)
        allUsers.value = data
        console.log('getAllUsersComplete')
    }


    const getFriends = async() => {
        const {data} = await supabase.from('users').select('friends').eq('id', user.value?.id)
        if(data![0].friends === null) return

 
        friends.value = allUsers.value?.filter(user => data![0].friends.includes(user.id))
        console.log('getFriends complete')
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
        return data
        
    }

    const acceptRequest = async(id: string, type:requestType) => {

       let friendsIds:string[] = [] 

        const {data, error} = await supabase.from('requests')
                                            .update({
                                                request_status: 'accepted'
                                            })
                                            .eq('sender_id', id)
                                            .eq('receiver_id', user.value?.id)
                                            .eq('request_name', type)
                                            .select('sender_id')
        if(error) throw (error)
       
        
        console.log(friends.value)
       
        if(friends.value === undefined){
                friendsIds.push(data[0].sender_id)
        }else{
                friendsIds = [...friends.value!.map((item:IUser) => item.id), data[0].sender_id]
        } 
    
      
        
        

      
       
       const {error:friendsError} = await supabase.from('users')
                        .update({
                            friends:friendsIds
                        })
                        .eq('id', user.value?.id)

       



                        


        if(friendsError) throw (friendsError)                
      
       
    }


    const acceptedFriends = async() => {

        let friendsIds:string[] = [] 
       

        const {data:checkRequest, error:checkRequestError} = await supabase.from('requests')
                                        .select('receiver_id')
                                        .eq('sender_id', user.value?.id)
                                        .eq('request_name', 'addFriend')
                                        .eq('request_status', 'accepted')


        if(checkRequestError) throw(checkRequestError)

        if(checkRequest!.length === 0) return

        if(friends.value?.includes(checkRequest[0].receiver_id)) return

        console.log(friends.value)
        if(friends.value === undefined){
                friendsIds.push(checkRequest[0].receiver_id)
        }else{
                console.log(friends.value)
                friendsIds = [...friends.value!.map((item:IUser) => item.id), checkRequest[0].receiver_id]
        } 
        
      
         
      
        const {error} = await supabase.from('users')
                        .update({
                            friends: friendsIds  
                        })
                        .eq('id', user.value?.id)

        if(error) throw (error)

        const { error:deleteRequestError} = await supabase.from('requests')
                        .delete()
                        .eq('sender_id', user.value?.id)
                        .eq('request_name', 'addFriend')
                        .eq('request_status', 'accepted')

        if(deleteRequestError) throw (deleteRequestError)

            console.log('acceptFriendsComplete')
                
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

    const notifications = async():Promise<IRequest[]> => {
        const {data, error} = await supabase.from('requests')
                                            .select()
                                            .eq('receiver_id', user.value?.id)
                                            .eq('request_status', 'pending')
        if(error) throw (error)
        return data
    }

    
   

    return {
        getAllUsers,
        allUsers,
        getFriends,
        friends,
        sendRequest,
        acceptRequest,
        rejectRequest,
        notifications,
        acceptedFriends
    }
}