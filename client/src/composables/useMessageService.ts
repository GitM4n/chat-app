import { supabase } from '@/supabaseClient'
import type { IMessage, IConservation} from '@/interfaces'


export const useMessageService = () => {
    const defineConservation = async(conservationObj:IConservation) =>{
        const {data, error}  = await supabase.from('conservation').select('id').eq('id', conservationObj.id).limit(1)
        if(error) throw error
        if(!data || data.length === 0) return
        await supabase.from('conservation').insert(conservationObj).select()
        console.log(data)
        
    }
    
    const sendPrivateMessage = async(msgObj:IMessage) =>{
      const {data, error}  = await supabase.from('messages').insert(msgObj).select()
      if(error) throw error
      console.log(data)

    }


    const getPrivateMessages = async() =>{
        const {data, error} = await supabase.from('messages').select()
        if(error) throw error
        console.log(data)
    }
    return{
        sendPrivateMessage,
        getPrivateMessages,
        defineConservation
    }
}