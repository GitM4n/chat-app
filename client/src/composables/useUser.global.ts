import {ref} from 'vue'
import type {IUser, RegisterPayload, LoginPayload} from '@/interfaces'
import {supabase} from '@/supabaseClient'





const userData = ref<IUser | null>()



export const useUser = () => {

const status = ref<string>('')


if(localStorage.getItem('user') !== 'undefined'){
    userData.value = JSON.parse(localStorage.getItem('user')!)
}   








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




    if(payload?.birthdate && payload?.birthdate !== userData.value?.birthdate && payload?.birthdate.length === 10 ){
       payload.age = getAge(payload?.birthdate)
    }

    const {data, error} = await supabase.from('users').update(payload).eq('id', userData.value?.id).select()

    if(error){
        throw error
    }

    if(data){
        userData.value = {...userData.value, ...payload} as IUser
        localStorage.setItem('user', JSON.stringify(userData.value))
        
    }

    
    
}


    function getAge(dateString:string):number {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age
    }


    function getAgeString(age:number):string{
        let count = age % 100

        if(count >= 10 && count <= 20){
            return age + ' лет'
        }else{
            count = age % 10
            if(count === 1){
                return age + ' год'
            }else if(count >= 2 && count <= 4){
                return age + ' года'
            }else{
                return age + ' лет'
            }
        }
    }

     function isLeapYear(year:string) {
        const numYear = parseInt(year);
        return !((numYear % 4) || (!(numYear % 100) && (numYear % 400)));
    };

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
        status,
        getAgeString
    }
}


