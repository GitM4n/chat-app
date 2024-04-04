import {ref} from 'vue'
import { useUser } from './useUser.global'
import {supabase} from '@/supabaseClient'
import type {IUser} from '@/interfaces'

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
        friends.value = allUsers.value?.filter(user => data![0].friends.includes(user.id))
    }

    
   

    return {
        getAllUsers,
        allUsers,
        getFriends,
        friends
    }
}