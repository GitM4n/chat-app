import {ref, onMounted} from 'vue'
import type {IUser, RegisterPayload, LoginPayload} from '@/interfaces'
import {supabase} from '@/supabaseClient'




const userData = ref<IUser | null>()



export const useUser = () => {

const status = ref<string>('')


if(localStorage.getItem('user') !== 'undefined'){
    userData.value = JSON.parse(localStorage.getItem('user')!)
}   
console.log('userdata', localStorage.getItem('user'))







const register = async(payload:RegisterPayload):Promise<any> => {
    const {data:user} = await supabase.from('users').select().eq('email', payload?.email).limit(1)
 
     if(user![0] !== undefined) {
        status.value = 'Такой пользователь уже существует'
        return {error: 'Такой пользователь уже существует'}
     }


     const {data, error} = await supabase.from('users').insert(payload).select('id, name, email, avatar')
     
     if(error) throw error

     userData.value = data[0]
     localStorage.setItem('user', JSON.stringify(data[0]))
    

    
     alert('Регистрация прошла успешно!')
  
}


const login = async(payload:LoginPayload):Promise<any> => {
    
    const {data, error} = await supabase.from('users').select().eq('email', payload?.email).limit(1)
    
  
    if(data?.length === 0){
        status.value = 'Такого пользователя не существует'
        return {error: 'Такой пользователь не существует'}
       
    }

    if(error)  throw error

    const {data:user, error:userError} = await supabase.from('users')
                                        .select('id, name, email, avatar')
                                        .eq('email', payload?.email)
                                        .eq('password', payload?.password)
                                        .limit(1)

    if(userError){
        alert('Неверный пароль')
        status.value = 'Неверный пароль'
        throw userError
    }
 
    userData.value = user[0]
    localStorage.setItem('user', JSON.stringify(user[0]))
    alert('Вход прошел успешно!')
}


const updateUser = async(payload: Partial<IUser> | null) => {

    const {data, error} = await supabase.from('users').update(payload).eq('id', userData.value?.id).select()

    if(error){
        throw error
    }

    if(data){
        userData.value = {...userData.value, ...payload} as IUser
        localStorage.setItem('user', JSON.stringify(userData.value))
        
    }
    
}

const signOut = async() => {
    await updateUser({
        online_status: false
    })

    userData.value = null
    localStorage.removeItem('user')
    
}

    return {
        userData,
        updateUser,
        signOut,
        register,
        login,
        status
    }
}


